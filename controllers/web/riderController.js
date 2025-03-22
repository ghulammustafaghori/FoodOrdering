const riderModel=require('../../models/rider.model')

let riderList=async (req,res)=>{
    let rider=await riderModel.find();
    res.send({
        status:1,
        message:"riders list",
        data:rider
    })
}
let insertRider=async(req,res)=>{
    let {name,phone,vehicle_type,password,retypePassword,vehicle_number,ratings,availability,completed_orders,joining_date}=req.body;
    let rider=new riderModel({
        name:name,
        phone:phone,
        password:password,
        retypePassword:retypePassword,
        vehicle_type:vehicle_type,
        vehicle_number:vehicle_number,
        ratings:ratings,
        availability:availability,
        completed_orders:completed_orders,
        joining_date:joining_date
    })
    await rider.save();
    res.send({
        status:1,
        message:"rider inserted successfully",
        data:rider
    })
}


let updateRider=async(req,res)=>{
    let {id}=req.params;
    let {name,phone,vehicle_type,vehicle_number,password,retypePassword,ratings,availability,completed_orders,joining_date}=req.body;
    let rider=await riderModel.updateOne({_id:id},{
        name:name,
        phone:phone,
        vehicle_type:vehicle_type,
        vehicle_number:vehicle_number,
        password:password,
        retypePassword:retypePassword,
        ratings:ratings,
        availability:availability,
        completed_orders:completed_orders,
        joining_date:joining_date
    })
    res.send({
        status:1,
        message:"rider updated successfully",
        data:rider
    })
}


let deleteRider=async(req,res)=>{
    let {id}=req.params;
    let rider=await riderModel.deleteOne({_id:id});
    res.send({
        status:1,
        message:"deleted successfully"
    })
}



module.exports={riderList,insertRider,updateRider,deleteRider}