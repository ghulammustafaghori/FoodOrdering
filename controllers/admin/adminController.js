const adminModel = require('../../models/admin.model');

let adminList= async(req,res)=>{
    const admin=await adminModel.find();
    res.send({
        status:1,
        message:"Admin fetched successfully",
        data:admin
    })
}
let insertAdmin= async(req,res)=>{
    let {name,email,password,retypePassword}=req.body;
    const admin= new adminModel({
        name,
        email,
        password,
        retypePassword
    })
    await admin.save();
    res.send({
        status:1,
        message:"Admin inserted successfully",
        data:admin
    })
}
let updateAdmin= async(req,res)=>{
    let {id}=req.params;
    let {name,email,password,retypePassword}=req.body;
    const admin= await adminModel.findByIdAndUpdate(id,{
        name,
        email,
        password,
        retypePassword
    })
    res.send({
        status:1,
        message:"Admin updated successfully",
        data:admin
    })
}
let deleteAdmin= async(req,res)=>{
    let {id}=req.params;
    const admin= await adminModel.findByIdAndDelete(id);
    res.send({
        status:1,
        message:"Admin deleted successfully",
        data:admin
    })
}
module.exports={
    adminList,
    insertAdmin,
    updateAdmin,
    deleteAdmin
}