const pendingRiderModel=require('../../models/pendingRider.model')
const axios = require('axios');
let pendingRiderList=async (req,res)=>{
    let rider=await riderModel.find();
    res.send({
        status:1,
        message:"riders list",
        data:rider
    })
}
let pendingInsertRider = async (req, res) => {
    let { name, phone, vehicle_type, password, retypePassword, vehicle_number, account_holder_name, account_number, iban, bank_name, ratings, availability, completed_orders, address, joining_date } = req.body;

    try {
        let latitude = null;
        let longitude = null;

        // 1️⃣ Call Nominatim API to get coordinates from address
        const geoResponse = await axios.get(`https://nominatim.openstreetmap.org/search`, {
            params: {
                q: address, // User-provided address
                format: "json",
                limit: 1
            }
        });

        // 2️⃣ If address not found, log a warning and skip coordinates update
        if (geoResponse.data.length > 0) {
            // 3️⃣ Extract latitude & longitude from API response
            let location = geoResponse.data[0];
            latitude = parseFloat(location.lat);
            longitude = parseFloat(location.lon);
            console.log("📍 Coordinates fetched:", latitude, longitude);
        } else {
            console.warn("⚠️ Address not found! Saving without coordinates.");
        }

        // 4️⃣ Create a new rider with address and coordinates if available
        let rider = new pendingRiderModel({
            name,
            phone,
            password,
            retypePassword,
            vehicle_type,
            vehicle_number,
            account_holder_name,
            account_number,
            iban,
            bank_name,
            ratings,
            availability,
            completed_orders,
            address: {
                text: address,  // Store user-entered address as text
                latitude: latitude,
                longitude: longitude
            },
            joining_date: new Date().toISOString().split('T')[0]
        });

        // 5️⃣ Save the rider
        await rider.save();
        res.send({
            status: 1,
            message: "Rider inserted successfully",
            data: rider
        });
    } catch (error) {
        console.error("Error inserting rider:", error.message);
        console.error("Stack trace:", error.stack); // This gives detailed error info

        res.status(500).send({
            status: 0,
            message: "Internal server error",
            error: error.message, // Send error message in response
        });
    }
};

let pendingDeleteRider=async(req,res)=>{
    let {id}=req.params;
    let rider=await pendingRiderModel.deleteOne({_id:id});
    res.send({
        status:1,
        message:"deleted successfully"
    })
}



module.exports={pendingRiderList,pendingInsertRider,pendingDeleteRider}