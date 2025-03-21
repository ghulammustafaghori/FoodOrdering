const mongoose = require('mongoose');
const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    orders:{
        type:Number,
    }
})
let userModel=mongoose.model('user',userSchema);
module.exports=userModel;