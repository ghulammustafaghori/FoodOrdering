const pendingRiderModel=require('../../models/pendingRider.model');
const riderModel=require('../../models/rider.model');
const axios = require('axios');
let pendingRiderList=async (req,res)=>{
    let rider=await pendingRiderModel.find();
    res.send({
        status:1,
        message:"riders list",
        data:rider
    })
}
let pendingInsertRider = async (req, res) => {
    let { name, phone, vehicle_type, password, retypePassword, vehicle_number, account_holder_name, account_number, iban, bank_name, ratings, availability, completed_orders, address, joining_date } = req.body;

    try {
        let latitude = 0;
        let longitude = 0;

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


const approvePendingRider = async (req, res) => {
    try {
        const riderId = req.params.id;
        console.log('Approving rider ID:', riderId);
    
        // 1. Find the pending rider
        const pendingRider = await pendingRiderModel.findById(riderId);
        if (!pendingRider) {
            console.error('Pending rider not found');
            return res.status(404).json({ 
                status: 0, 
                message: 'Pending rider not found' 
            });
        }
    
        // 2. Prepare data for approved rider
        const riderData = {
            ...pendingRider.toObject(),
            _id: undefined, // Remove original ID to prevent duplicate key
            status: 'approved',
            approvedAt: new Date() // Add approval timestamp
        };
        
        // 3. Create in main collection
        const approvedRider = await riderModel.create(riderData);
        console.log('Created approved rider:', approvedRider._id);
    
        // 4. Delete from pending collection
        await pendingRiderModel.findByIdAndDelete(riderId);
        console.log('Removed pending rider');
    
        res.send({
            status: 1,
            message: "Rider approved successfully",
            data: approvedRider
        });
    } catch (error) {
        console.error("Error approving rider:", error.message);
        console.error("Stack trace:", error.stack); // This gives detailed error info
    
        res.status(500).send({
            status: 0,
            message: "Internal server error",
            error: error.message, // Send error message in response
        });
    }
    };
        

module.exports={pendingRiderList,pendingInsertRider,pendingDeleteRider,approvePendingRider};