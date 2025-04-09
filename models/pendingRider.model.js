const mongoose=require('mongoose');
let pendingRiderSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    vehicle_type:{
        type:String,
        required:true
    },
    vehicle_number:{
        type:String,
        required:true
    },
    account_holder_name:{
        type:String,
        required:true
    },
    account_number:{
        type:String,
        required:true
    },
    iban:{
        type:String,
        required:true
    },
    bank_name:{
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
    ratings:{
        type:String,
        
    },
    availability:{
        type:String,
       
    },
    completed_orders:{
        type:Number,
       
    },
    joining_date:{
        type:Date,
    },
    address:{
        text: { type: String, required: true },  // Store address as text
        latitude: { type: Number, required: true }, // Store latitude
        longitude: { type: Number, required: true } // Store longitude
    },

})
let pendingRiderModel= new mongoose.model('pendingRider',pendingRiderSchema);
module.exports=pendingRiderModel;