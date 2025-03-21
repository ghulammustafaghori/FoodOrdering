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

let updateUser= async(req,res)=>{
    let userId=req.params.id;
    let {name,phone,email,address,orders}=req.body;
    let updateObj={
        name:name,
        phone:phone,
        email:email,
        address:address,
        orders:orders
    } // updateObj is an object that contains the updated values of the user
    let updatedUser=await userModel.updateOne({_id:userId},updateObj);
    res.send({
        status:1,
        message:"User updated successfully",
        data:updatedUser
    })

}
let deleteUser= async(req,res)=>{
    let userId=req.params.id;
    let deleteUser=await userModel.deleteOne({_id:userId});
    res.send({
        status:1,
        message:"User deleted successfully",
        data:deleteUser
    })
}
    
module.exports={userList,insertUser,updateUser,deleteUser};