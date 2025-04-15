const featureRestaurantModel = require("../../models/featureRestaurant.model");
const restaurantModel = require("../../models/restaurant.model");
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
    let imagePath;

    if (req.file) {
      imagePath = req.file.filename;
    } else if (req.body.image) {
      // Handle case where image is a full URL — extract just the filename
      const imageParts = req.body.image.split('/');
      imagePath = imageParts[imageParts.length - 1];
    } else {
      imagePath = null;
    }
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




let featureExistingRestaurant = async (req, res) => {
    const { id } = req.params;

    try {
        const existingRestaurant = await restaurantModel.findById(id);

        if (!existingRestaurant) {
            return res.status(404).send({
                status: 0,
                message: "Restaurant not found",
            });
        }

        const alreadyFeatured = await featureRestaurantModel.findOne({ name: existingRestaurant.name });
        if (alreadyFeatured) {
            return res.status(409).send({
                status: 0,
                message: "Restaurant already featured",
            });
        }

        const featured = new featureRestaurantModel({
            name: existingRestaurant.name,
            phone: existingRestaurant.phone,
            ratings: existingRestaurant.ratings,
            image: existingRestaurant.image,
            address: existingRestaurant.address,
            owner_name: existingRestaurant.owner_name,
            owner_phone: existingRestaurant.owner_phone,
            owner_email: existingRestaurant.owner_email,
            type: existingRestaurant.type,
            orders: existingRestaurant.orders,
            location: existingRestaurant.location
        });

        await featured.save();

        res.send({
            status: 1,
            message: "Restaurant featured successfully",
            data: featured
        });

    } catch (error) {
        console.error("💥 Feature insert error:", error.message);
        res.status(500).send({
            status: 0,
            message: "Error featuring restaurant",
            error: error.message
        });
    }
};

module.exports={featureRestaurantList,insertFeatureRestaurant,featureRestaurantDelete,fileUpload,featureExistingRestaurant};