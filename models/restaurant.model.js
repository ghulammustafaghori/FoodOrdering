const mongoose=require('mongoose');
const restaurantSchema=new mongoose.Schema({
    image:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    ratings:{
        type:Number,
       
    },
    address:{
        text: { type: String, required: true },  // Store address as text
        latitude: { type: Number, required: true }, // Store latitude
        longitude: { type: Number, required: true } // Store longitude
    },
    owner_name:{
        type:String,
        required:true
    },
    owner_phone:{
        type:String,
        required:true
    },
    owner_email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        require:true
    },
    retypePassword:{
        type:String,
        require:true
    },
    type:{
        type:String,
        required:true
    },
    orders:{
        type:Number
    }
})
let restaurantModel=mongoose.model('restaurant',restaurantSchema);
module.exports=restaurantModel;