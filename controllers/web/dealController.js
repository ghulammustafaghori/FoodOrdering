const dealModel=require('../../models/menu.model');
const fs = require('fs');
const multer = require('multer');

let readDeal=async(req,res)=>{
    let deal=await dealModel.find();
    res.send({
        status:1,
        message:"Deal fetched successfully",
        data:deal
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

let insertDeal=async(req,res)=>{
    const imagePath = req.file ? `${req.file.filename}` : null;

    try {
    let {name,price}=req.body;
    let deal=new dealModel({
        name:name,
        image:imagePath,
        price:price
    })
    await deal.save();
    res.send({
        status:1,
        message:"Deal inserted successfully",
        data:deal
    })} catch (error) {
        res.send({
            status:0,
            message:"Menu not inserted",
            error:error.message
        })
    }
}

let updateDeal=async(req,res)=>{
    let {id}=req.params;
    let {name,image,price}=req.body;
    let deal=await dealModel.updateOne({_id:id},{
        name:name,
        image:image,
        price:price
    })
    res.send({
        status:1,
        message:"Deal updated successfully",
        data:deal
    })
}

let deleteDeal=async(req,res)=>{
    let {id}=req.params;
    let deal=await dealModel.deleteOne({_id:id});
    res.send({
        status:1,
        message:"Deal deleted successfully",
        data:deal
    })
}
module.exports={readDeal,insertDeal,updateDeal,deleteDeal};