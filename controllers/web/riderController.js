const riderModel=require('../../models/rider.model')
const axios = require('axios');
let riderList=async (req,res)=>{
    let rider=await riderModel.find();
    res.send({
        status:1,
        message:"riders list",
        data:rider
    })
}
let insertRider=async(req,res)=>{
    let {name,phone,vehicle_type,password,retypePassword,vehicle_number,account_holder_name,account_number,iban,bank_name,ratings,availability,completed_orders,address,joining_date}=req.body;

    
        try {
            // 1️⃣ Call Nominatim API to get coordinates from address
            const geoResponse = await axios.get(`https://nominatim.openstreetmap.org/search`, {
                params: {
                    q: address, // User-provided address
                    format: "json",
                    limit: 1
                }
            });
    
            // 2️⃣ If address not found, return an error
            if (!geoResponse.data.length) {
                return res.status(400).send({
                    status: 0,
                    message: "Invalid address. Unable to fetch location coordinates."
                });
            }
    
            // 3️⃣ Extract latitude & longitude from API response
            let location = geoResponse.data[0];
            let latitude = parseFloat(location.lat);
            let longitude = parseFloat(location.lon);



    let rider=new riderModel({
        name:name,
        phone:phone,
        password:password,
        retypePassword:retypePassword,
        vehicle_type:vehicle_type,
        vehicle_number:vehicle_number,
        account_holder_name:account_holder_name,
        account_number:account_number,
        iban:iban,
        bank_name:bank_name,
        ratings:ratings,
        availability:availability,
        completed_orders:completed_orders,
        address: { 
            text: address, // Store user-entered address as text
            latitude: latitude, 
            longitude: longitude
        },
        joining_date: new Date().toISOString().split('T')[0]
    })
    await rider.save();
    res.send({
        status:1,
        message:"rider inserted successfully",
        data:rider
    })
}
catch (error) {
    console.error("Error inserting rider", error);
    res.status(500).send({
        status: 0,
        message: "Internal server error"
    });
}
}


let updateRider=async(req,res)=>{
    let {id}=req.params;
    let {name,phone,vehicle_type,vehicle_number, account_holder_name,account_number,iban,bank_name,password,retypePassword,ratings,availability,completed_orders,joining_date,address}=req.body;
    let rider=await riderModel.updateOne({_id:id},{
        name:name,
        phone:phone,
        vehicle_type:vehicle_type,
        vehicle_number:vehicle_number,
        account_holder_name:account_holder_name,
        account_number:account_number,
        iban:iban,
        bank_name:bank_name,
        password:password,
        retypePassword:retypePassword,
        ratings:ratings,
        availability:availability,
        completed_orders:completed_orders,
        joining_date:joining_date
    })
    res.send({
        status:1,
        message:"rider updated successfully",
        data:rider
    })
}


let deleteRider=async(req,res)=>{
    let {id}=req.params;
    let rider=await riderModel.deleteOne({_id:id});
    res.send({
        status:1,
        message:"deleted successfully"
    })
}



module.exports={riderList,insertRider,updateRider,deleteRider}