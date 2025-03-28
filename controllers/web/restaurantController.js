const restaurantModel = require('../../models/restaurant.model');
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

let insertRestaurant=async (req,res)=>{
    const image = req.file ? req.file.filename : null;
    const baseUrl = `${req.protocol}://${req.get('host')}/uploads/`;
    try {
        // Check if an image is uploaded
        const image = req.file ? req.file.filename : null;
    let {name,phone,ratings,address,password,retypePassword,owner_name,owner_phone,owner_email,type}=req.body;
  
    const restaurant=new restaurantModel({
        image:image,
        name:name,
        password:password,
        retypePassword:retypePassword,
        phone:phone,
        ratings:ratings,
        address:address,
        owner_name:owner_name,
        owner_phone:owner_phone,
        owner_email:owner_email,
        type:type
    })
    await restaurant.save();
    res.send({
        status:1,
        message:"Restaurant inserted successfully",
        data:restaurant
    })
} catch (error) {
    res.status(500).send({
        status: 0,
        message: "Error inserting restaurant",
        error: error.message
    });
}
}

let restaurantUpdate=async(req,res)=>{
    let {id}=req.params;
    let{image,name,phone,ratings,address,password,retypePassword,owner_name,owner_phone,owner_email,type}=req.body;
    const restaurant=await restaurantModel.updateOne({_id:id},{
        image:image,
        name:name,
        phone:phone,
        ratings:ratings,
        address:address,
        password:password,
        retypePassword:retypePassword,
        owner_name:owner_name,
        owner_phone:owner_phone,
        owner_email:owner_email,
        type:type
    })
    res.send({
        status:1,
        message:"Restaurant updated successfully",
        data:restaurant
    })
}


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