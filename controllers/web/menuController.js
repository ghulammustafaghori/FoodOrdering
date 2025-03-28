const menuModel=require('../../models/menu.model');

let readMenu=async(req,res)=>{
    let menu=await menuModel.find();
    res.send({
        status:1,
        message:"Menu fetched successfully",
        data:menu
    })
}

let insertMenu=async(req,res)=>{
    let {name,image,price}=req.body;
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
    })
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