const dealModel=require('../../models/menu.model');

let readDeal=async(req,res)=>{
    let deal=await dealModel.find();
    res.send({
        status:1,
        message:"Menu fetched successfully",
        data:deal
    })
}

let insertDeal=async(req,res)=>{
    let {name,image,price}=req.body;
    let deal=new dealModel({
        name:name,
        image:image,
        price:price
    })
    await deal.save();
    res.send({
        status:1,
        message:"Menu inserted successfully",
        data:deal
    })
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
        message:"Menu updated successfully",
        data:deal
    })
}

let deleteDeal=async(req,res)=>{
    let {id}=req.params;
    let deal=await dealModel.deleteOne({_id:id});
    res.send({
        status:1,
        message:"Menu deleted successfully",
        data:deal
    })
}
module.exports={readDeal,insertDeal,updateDeal,deleteDeal};