const restaurantModel = require('../../models/restaurant.model');

let restaurantList= async(req,res)=>{
    const restaurants=await restaurantModel.find();
    res.send({
        status:1,
        message:"Restaurants fetched successfully",
        data:restaurants
    })
}
let insertRestaurant=async (req,res)=>{
    let {image,name,phone,ratings,address,owner_name,owner_phone,owner_email,type}=req.body;
  
    const restaurant=new restaurantModel({
        image:image,
        name:name,
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
}

let restaurantUpdate=async(req,res)=>{
    let {id}=req.params;
    let{image,name,phone,ratings,address,owner_name,owner_phone,owner_email,type}=req.body;
    const restaurant=await restaurantModel.updateOne({_id:id},{
        image:image,
        name:name,
        phone:phone,
        ratings:ratings,
        address:address,
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




module.exports={restaurantList,insertRestaurant,restaurantUpdate,restaurantDelete};