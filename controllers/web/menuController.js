const menuModel=require('../../models/menu.model');
const fs = require('fs');
const multer = require('multer');


let readMenu=async(req,res)=>{
    let menu=await menuModel.find();
    res.send({
        status:1,
        message:"Menu fetched successfully",
        data:menu
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
let insertMenu=async(req,res)=>{
    const imagePath = req.file ? `${req.file.filename}` : null;

    try {
        // Check if an image is uploaded
        const image = req.file ? req.file.filename : null;
    let {name,price}=req.body;
    let menu=new menuModel({
        name:name,
        image:image,
        description:description,
        category:category,
        price:price
    })
    await menu.save();
    res.send({
        status:1,
        message:"Menu inserted successfully",
        data:menu
    })} catch (error) {
        res.send({
            status:0,
            message:"Menu not inserted",
            error:error.message
        })
    }
}

let updateMenu=async(req,res)=>{
    let {id}=req.params;
    let {name,image,description,
        category,price}=req.body;
    let menu=await menuModel.updateOne({_id:id},{
        name:name,
        image:image,
        description:description,
        category:category,
        price:price
    })
    res.send({
        status:1,
        message:"Menu updated successfully",
        data:menu
    })
}

let deleteMenu=async(req,res)=>{
    let {id}=req.params;
    let menu=await menuModel.deleteOne({_id:id});
    res.send({
        status:1,
        message:"Menu deleted successfully",
        data:menu
    })
}

module.exports={readMenu,insertMenu,updateMenu,deleteMenu};