const restaurantModel = require('../../models/restaurant.model');
const axios = require('axios');
const multer = require('multer');
const fs = require('fs');
let restaurantList= async(req,res)=>{
    const restaurants=await restaurantModel.find();
    res.send({
        status:1,
        message:"Restaurants fetched successfully",
        data:restaurants
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

let insertRestaurant = async (req, res) => {
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
        const restaurant = new restaurantModel({
            image: imagePath,
            name: name,
            password: password,
            retypePassword: retypePassword,
            phone: phone,
            ratings: ratings,
            address: {
                text: address,  // Store user-entered address as text
                latitude: latitude,
                longitude: longitude
            },
            owner_name: owner_name,
            owner_phone: owner_phone,
            owner_email: owner_email,
            type: type,
            orders: orders
        });

        // 4️⃣ Save the restaurant
        await restaurant.save();
        res.send({
            status: 1,
            message: "Restaurant inserted successfully",
            data: restaurant
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


let restaurantUpdate = async (req, res) => {
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
            } else {
                console.warn("⚠️ Address not found! Saving without coordinates.");
                updateObj.address = { text: address }; // Save only text address
            }
        }

        // 5️⃣ Update the restaurant
        let updatedRestaurant = await restaurantModel.findByIdAndUpdate(id, updateObj, { new: true });

        // 6️⃣ If restaurant not found, return error
        if (!updatedRestaurant) {
            return res.status(404).send({
                status: 0,
                message: "Restaurant not found"
            });
        }

        // 7️⃣ Send response
        res.send({
            status: 1,
            message: "Restaurant updated successfully",
            data: updatedRestaurant
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



let restaurantDelete=async(req,res)=>{
    let {id}=req.params;
    const restaurant=await restaurantModel.deleteOne({_id:id})
    res.send({
        status:1,
        message:"Restaurant deleted successfully",
        data:restaurant
    })
}




module.exports={restaurantList,insertRestaurant,restaurantUpdate,restaurantDelete,fileUpload};