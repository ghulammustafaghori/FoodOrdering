const mongoose=require('mongoose');
let riderSchema= new mongoose.Schema({
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
        required:true
    },
    availability:{
        type:String,
        required:true
    },
    completed_orders:{
        type:Number,
        required:true
    },
    joining_date:{
        type:Date,
        required:true
    }

})
let riderModel= new mongoose.model('rider',riderSchema);
module.exports=riderModel;