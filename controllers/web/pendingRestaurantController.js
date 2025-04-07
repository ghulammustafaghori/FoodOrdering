const pendingRestaurantModel = require('../../models/pendingRestaurant.model');
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
    const baseUrl = `${req.protocol}://${req.get('host')}/uploads/`;

    try {
        let { name, phone, ratings, address, password, retypePassword, owner_name, owner_phone, owner_email, type, orders } = req.body;

        // 1️⃣ Call Nominatim API to get coordinates from address
        const geoResponse = await axios.get(`https://nominatim.openstreetmap.org/search`, {
            params: {
                q: address, // User-provided address
                format: "json",
                limit: 1
            }
        });

        // 2️⃣ If address not found, return a warning and skip coordinates
        let latitude = null;
        let longitude = null;

        if (geoResponse.data.length > 0) {
            let location = geoResponse.data[0];
            latitude = parseFloat(location.lat);
            longitude = parseFloat(location.lon);
            console.log("📍 Coordinates fetched:", latitude, longitude);
        } else {
            console.warn("⚠️ Address not found! Saving without coordinates.");
        }

        // 3️⃣ Create the restaurant object with the address and coordinates
       // 3️⃣ Build the restaurant object dynamically
const pendingRestaurantData = {
    image: imagePath,
    name,
    password,
    retypePassword,
    phone,
    ratings,
    address: {
        text: address,
        latitude: latitude || "",  // Add empty string if no latitude
        longitude: longitude || ""  // Add empty string if no longitude
    },
    owner_name,
    owner_phone,
    owner_email,
    type,
    orders
};

// ✅ Add `location` only if coordinates are found
if (latitude && longitude) {
    pendingRestaurantData.location = {
        type: 'Point',
        coordinates: [longitude, latitude]
    };
}

const pendingRestaurant = new pendingRestaurantModel(pendingRestaurantData);


        // 4️⃣ Save the restaurant
        await pendingRestaurant.save();
        res.send({
            status: 1,
            message: "Pending Restaurant inserted successfully",
            data: pendingRestaurant
        });
    } catch (error) {
        console.error("Error inserting restaurant:", error.message);
        console.error("Stack trace:", error.stack);

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
    const pendingRestaurant=await pendingRestaurantModel.deleteOne({_id:id})
    res.send({
        status:1,
        message:"Restaurant deleted successfully",
        data:pendingRestaurant
    })
}




module.exports={pendingRestaurantList,insertPendingRestaurant,pendingRestaurantUpdate,pendingRestaurantDelete,fileUpload};