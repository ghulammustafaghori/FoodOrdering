const userModel = require('../../models/user.model');
let userList= async(req,res)=>{
    const users=await userModel.find();
    res.send({
        status:1,
        message:"Users fetched successfully",
        data:users
    })
}
    
module.exports={userList};