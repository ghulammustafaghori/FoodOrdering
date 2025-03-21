const userModel = require('../../models/user.model');
let userList= async(req,res)=>{
    const users=await userModel.find();
    res.send({
        status:1,
        message:"Users fetched successfully",
        data:users
    })
}
let insertUser= async(req,res)=>{
    let {name,phone,email,address,orders}=req.body;
    const user=new userModel({
        name:name,
        phone:phone,
        email:email,
        address:address,
        orders:orders
    })
   await user.save();
    res.send({
        status:1,
        message:"User inserted successfully",
        data:user
    })
}
    
module.exports={userList,insertUser};