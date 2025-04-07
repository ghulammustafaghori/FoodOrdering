const mongoose=require('mongoose');
const pendingRestaurantSchema=new mongoose.Schema({
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
    address: {
        text: { type: String, required: true },  // Store address as text
    },
    location: { 
        type: { 
            type: String,
             enum: ["Point"],
              required: false,
               default: "Point"
             },
        coordinates: { 
            type: [Number]
        }
            
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
// ✅ Create geospatial index
pendingRestaurantSchema.index({ location: "2dsphere" }); // Create a 2dsphere index on the location field
let pendingRestaurantModel=mongoose.model('pendingRestaurant',pendingRestaurantSchema);
module.exports=pendingRestaurantModel;