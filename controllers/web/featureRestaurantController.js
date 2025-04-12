const featureRestaurantModel = require("../../models/featureRestaurant.model");
const axios = require('axios');
const multer = require('multer');
const fs = require('fs');
let featureRestaurantList= async(req,res)=>{
    const restaurants=await featureRestaurantModel.find();
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

let insertFeatureRestaurant = async (req, res) => {
    const imagePath = req.file ? `${req.file.filename}` : null;
    const baseUrl = `${req.protocol}://${req.get('host')}/uploads/`;

    let {
        name, phone, ratings, address,
        password, retypePassword,
        owner_name, owner_phone, owner_email,
        type, orders
    } = req.body;

    let latitude = 0;
    let longitude = 0;

    try {
        // 🌍 Try to get coordinates using Nominatim
        const geoResponse = await axios.get(`https://nominatim.openstreetmap.org/search`, {
            params: {
                q: address,
                format: "json",
                limit: 1
            }
        });

        if (geoResponse.data.length > 0) {
            const location = geoResponse.data[0];
            latitude = parseFloat(location.lat);
            longitude = parseFloat(location.lon);
        } else {
            console.warn("⚠️ Nominatim could not find coordinates. Using default 0,0.");
        }
    } catch (geoError) {
        console.error("🌐 Geocoding error:", geoError.message);
        console.warn("⚠️ Setting coordinates to 0,0 due to error.");
    }

    try {
        const restaurant = new featureRestaurantModel({
            image: imagePath,
            name,
            password,
            retypePassword,
            phone,
            ratings,
            address: {
                text: address,
                latitude,
                longitude
            },
            location: {
                type: "Point",
                coordinates: [longitude, latitude]
            },
            owner_name,
            owner_phone,
            owner_email,
            type,
            orders
        });

        await restaurant.save();

        res.send({
            status: 1,
            message: "Restaurant inserted successfully",
            data: restaurant
        });
    } catch (error) {
        console.error("💥 Save error:", error.message);
        res.status(500).send({
            status: 0,
            message: "Error inserting restaurant",
            error: error.message
        });
    }
};





let featureRestaurantDelete=async(req,res)=>{
    let {id}=req.params;
    const restaurant=await featureRestaurantModel.deleteOne({_id:id})
    res.send({
        status:1,
        message:"Restaurant deleted successfully",
        data:restaurant
    })
}




module.exports={featureRestaurantList,insertFeatureRestaurant,featureRestaurantDelete,fileUpload};