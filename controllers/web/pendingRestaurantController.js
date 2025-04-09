const pendingRestaurantModel = require('../../models/pendingRestaurant.model');
const restaurantModel = require('../../models/restaurant.model');
const axios = require('axios');
const multer = require('multer');
const fs = require('fs');
let pendingRestaurantList= async(req,res)=>{
    const pendingRestaurants=await pendingRestaurantModel.find();
    res.send({
        status:1,
        message:"Pending Restaurants fetched successfully",
        data:pendingRestaurants
    })
}
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const fileUpload = multer({
    storage: multer.diskStorage({
        destination: function (req,file,callback) {
            callback(null,uploadDir);
        },
        filename: function (req,file,callback) {
            const ext = file.originalname.split('.').pop(); // Get file extension
            const uniqueName = file.fieldname + "." + Date.now() + "." + ext;
            callback(null, uniqueName);
        }
    })
}).single('my_file');

let insertPendingRestaurant = async (req, res) => {
    const imagePath = req.file ? `${req.file.filename}` : null;

    try {
        let {
            name,
            phone,
            ratings,
            address,
            password,
            retypePassword,
            owner_name,
            owner_phone,
            owner_email,
            type,
            orders
        } = req.body;

        // Initialize coordinates as null
        let latitude = null;
        let longitude = null;

        // Try to fetch coordinates from Nominatim API
        try {
            const geoResponse = await axios.get(`https://nominatim.openstreetmap.org/search`, {
                params: {
                    q: address,
                    format: "json",
                    limit: 1
                }
            });

            if (geoResponse.data.length > 0) {
                let location = geoResponse.data[0];
                latitude = parseFloat(location.lat);
                longitude = parseFloat(location.lon);
                console.log("📍 Coordinates fetched:", latitude, longitude);
            } else {
                console.warn("⚠️ Address not found, using default coordinates.");
            }
        } catch (geoErr) {
            console.warn("⚠️ Geocoding failed, using default coordinates.");
        }

        // If no valid coordinates found, set to [0, 0]
        if (latitude === null || longitude === null || isNaN(latitude) || isNaN(longitude)) {
            latitude = 0;
            longitude = 0;
        }

        // Build the restaurant object
        const pendingRestaurantData = {
            image: imagePath,
            name,
            password,
            retypePassword,
            phone,
            ratings,
            address: {
                text: address
            },
            owner_name,
            owner_phone,
            owner_email,
            type,
            orders
        };

        // Add location with the coordinates
        pendingRestaurantData.location = {
            type: 'Point',
            coordinates: [longitude, latitude] // Coordinates in [longitude, latitude] format
        };

        // Log the final pendingRestaurantData to see if the location is correctly set
        console.log("✅ Restaurant Data to be Saved:", pendingRestaurantData);

        // Save the restaurant data to DB
        const pendingRestaurant = new pendingRestaurantModel(pendingRestaurantData);
        await pendingRestaurant.save();

        res.send({
            status: 1,
            message: "Pending Restaurant inserted successfully",
            data: pendingRestaurant
        });

    } catch (error) {
        console.error("❌ Error inserting restaurant:", error.message);
        res.status(500).send({
            status: 0,
            message: "Internal server error",
            error: error.message
        });
    }
};



let pendingRestaurantUpdate = async (req, res) => {
    let { id } = req.params;
    let { image, name, phone, ratings, address, password, retypePassword, owner_name, owner_phone, owner_email, type } = req.body;

    try {
        let updateObj = {
            image,
            name,
            phone,
            ratings,
            password,
            retypePassword,
            owner_name,
            owner_phone,
            owner_email,
            type
        };

        // 1️⃣ Check if address is provided in the update request
        if (address) {
            let latitude = null;
            let longitude = null;

            // 2️⃣ Call Nominatim API to get coordinates from address
            const geoResponse = await axios.get(`https://nominatim.openstreetmap.org/search`, {
                params: {
                    q: address, // User-provided address
                    format: "json",
                    limit: 1
                }
            });

            // 3️⃣ If address not found, return a warning and skip coordinates
            if (geoResponse.data.length > 0) {
                let location = geoResponse.data[0];
                latitude = parseFloat(location.lat);
                longitude = parseFloat(location.lon);
                console.log("📍 Coordinates fetched:", latitude, longitude);

                // 4️⃣ Add address details to the update object
                updateObj.address = {
                    text: address,  // Store user-entered address as text
                    latitude: latitude,
                    longitude: longitude
                };
                updateObj.location = {
                    type: 'Point',
                    coordinates: [longitude, latitude]
                };
            } else {
                console.warn("⚠️ Address not found! Saving without coordinates.");
                updateObj.address = { text: address };
                // Optional: remove previous location
                updateObj.location = undefined;
                
            }
        }

        // 5️⃣ Update the restaurant
        let updatedPendingRestaurant = await pendingRestaurantModel.findByIdAndUpdate(id, updateObj, { new: true });

        // 6️⃣ If restaurant not found, return error
        if (!updatedPendingRestaurant) {
            return res.status(404).send({
                status: 0,
                message: "Restaurant not found"
            });
        }

        // 7️⃣ Send response
        res.send({
            status: 1,
            message: "Restaurant updated successfully",
            data: updatedPendingRestaurant
        });
    } catch (error) {
        console.error("Error updating restaurant:", error.message);
        console.error("Stack trace:", error.stack);

        res.status(500).send({
            status: 0,
            message: "Internal server error",
            error: error.message
        });
    }
};



let pendingRestaurantDelete=async(req,res)=>{
    let {id}=req.params;
    console.log('Deleting restaurant with ID:', id); 
    const pendingRestaurant=await pendingRestaurantModel.deleteOne({_id:id})
    res.send({
        status:1,
        message:"Restaurant deleted successfully",
        data:pendingRestaurant
    })
}


const approvePendingRestaurant = async (req, res) => {
    try {
        const restaurantId = req.params.id;
        console.log('Approving restaurant ID:', restaurantId);

        // 1. Find the pending restaurant
        const pendingRestaurant = await pendingRestaurantModel.findById(restaurantId);
        if (!pendingRestaurant) {
            console.error('Pending restaurant not found');
            return res.status(404).json({ 
                status: 0, 
                message: 'Pending restaurant not found' 
            });
        }

        // 2. Prepare data for approved restaurant
        const restaurantData = {
            ...pendingRestaurant.toObject(),
            _id: undefined, // Remove original ID to prevent duplicate key
            status: 'approved',
            approvedAt: new Date() // Add approval timestamp
        };
        
        // 3. Create in main collection
        const approvedRestaurant = await restaurantModel.create(restaurantData);
        console.log('Created approved restaurant:', approvedRestaurant._id);

        // 4. Delete from pending collection
        await pendingRestaurantModel.findByIdAndDelete(restaurantId);
        console.log('Removed pending restaurant');

        // 5. Send success response
        res.status(200).json({ 
            status: 1, 
            message: 'Restaurant approved successfully',
            data: approvedRestaurant
        });

    } catch (error) {
        console.error('Approval failed:', error.message);
        
        // Handle duplicate key errors separately
        if (error.code === 11000) {
            return res.status(409).json({
                status: 0,
                message: 'Restaurant already exists in approved collection'
            });
        }

        res.status(500).json({
            status: 0,
            message: 'Failed to approve restaurant',
            error: process.env.NODE_ENV === 'development' ? {
                message: error.message,
                type: error.name
            } : undefined
        });
    }
};




module.exports={pendingRestaurantList,insertPendingRestaurant,pendingRestaurantUpdate,approvePendingRestaurant,pendingRestaurantDelete,fileUpload};