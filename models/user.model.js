const mongoose = require('mongoose');
const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        require:true
    },
    retypePassword:{
        type:String,
        require:true
    },
    phone:{
        type:Number,
        required:true
    },
    address:{
        text: { type: String, required: true },  // Store address as text
        latitude: { type: Number, required: true }, // Store latitude
        longitude: { type: Number, required: true } // Store longitude
    },
    orders:{
        type:Number,
    }
})
let userModel=mongoose.model('user',userSchema);
module.exports=userModel;