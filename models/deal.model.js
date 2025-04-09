const mongoose = require('mongoose');
const dealSchema= new mongoose.Schema({
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
    price:{
        type:Number,
        required:true
    },
    restaurantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'restaurant', // assuming your restaurant model is called 'restaurant'
            required: true
        }
})
let dealModel=mongoose.model('deal',dealSchema);
module.exports=dealModel;