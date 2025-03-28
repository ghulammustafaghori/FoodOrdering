const mongoose = require('mongoose');
const menuSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    image:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    price:{
        type:Number,
    }
})
let menuModel=mongoose.model('menu',menuSchema);
module.exports=menuModel;