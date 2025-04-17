const dealModel=require('../../models/deal.model');
const fs = require('fs');
const multer = require('multer');
const axios = require('axios');
const mongoose = require('mongoose');


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
    let {name,price,description,restaurantId}=req.body;
    let deal=new dealModel({
        name:name,
        image:imagePath,
        price:price,
        description:description,
        restaurantId:restaurantId
    })
    await deal.save();
    res.send({
        status:1,
        message:"Deal inserted successfully",
        data:deal
    })} catch (error) {
        res.send({
            status:0,
            message:"Deal not inserted",
            error:error.message
        })
    }
}

const updateDeal = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.send({
                status: 0,
                message: "Invalid deal ID"
            });
        }

        // Build update object dynamically
        const updateFields = {};
        const { name, image, price } = req.body;

        if (name) updateFields.name = name;
        if (image) updateFields.image = image;
        if (price) updateFields.price = price;

        if (Object.keys(updateFields).length === 0) {
            return res.send({
                status: 0,
                message: "No valid fields provided for update"
            });
        }

        const result = await dealModel.updateOne(
            { _id: id },
            { $set: updateFields }
        );

        if (!result.acknowledged) {
            return res.send({
                status: 0,
                message: "Update not acknowledged by database",
                data: result
            });
        }

        if (result.matchedCount === 0) {
            return res.send({
                status: 0,
                message: "No deal found with the given ID",
                data: result
            });
        }

        if (result.modifiedCount === 0) {
            return res.send({
                status: 0,
                message: "No changes made to the deal (data may be the same)",
                data: result
            });
        }

        res.send({
            status: 1,
            message: "Deal updated successfully",
            data: result
        });

    } catch (error) {
        res.send({
            status: 0,
            message: "Error updating deal",
            error: error.message
        });
    }
};


let deleteDeal=async(req,res)=>{
    let {id}=req.params;
    let deal=await dealModel.deleteOne({_id:id});
    res.send({
        status:1,
        message:"Deal deleted successfully",
        data:deal
    })
}
module.exports={readDeal,insertDeal,updateDeal,deleteDeal,fileUpload};