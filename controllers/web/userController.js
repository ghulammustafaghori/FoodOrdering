const userModel = require('../../models/user.model');
const axios=require('axios');
let userList= async(req,res)=>{
    const users=await userModel.find();
    res.send({
        status:1,
        message:"Users fetched successfully",
        data:users
    })
}
let insertUser= async(req,res)=>{
    let {name,phone,email,password,retypePassword,address,orders}=req.body;
    // let locationData=await axios.get('https://maps.googleapis.com/maps/api/geocode/json',{
    //     params: {address:address,key:process.env.GOOGLE_MAPS_API_KEY}
    // })
    
    // let location = locationData.data.results[0]?.geometry.location;
    // if (!location) {
    //     return res.send({ status: 0, message: "Invalid address. Unable to get location." });
    //   }

    


    const user=new userModel({
        name:name,
        email:email,
        password:password,
        retypePassword:retypePassword,
        phone:phone,
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
    let {name,phone,email,password,retypePassword,address,orders}=req.body;
    let updateObj={
        name:name,
        phone:phone,
        email:email,
        password:password,
        retypePassword:retypePassword,
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