const mongoose=require('mongoose');
const featureRestaurantSchema=new mongoose.Schema({
    image:{
        type:String,
        required:false
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
    address: {
        text: { type: String, required: true },  // Store address as text
    },
    location: { 
        type: { type: String, enum: ["Point"], required: false, default: "Point" },
        coordinates: { type: [Number], required: false } // [longitude, latitude]
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
   
    type:{
        type:String,
        required:true
    },
    orders:{
        type:Number
    }
})
// ✅ Create geospatial index
featureRestaurantSchema.index({ location: "2dsphere" }); // Create a 2dsphere index on the location field
let featureRestaurantModel=mongoose.model('featureRestaurant',featureRestaurantSchema);
module.exports=featureRestaurantModel;