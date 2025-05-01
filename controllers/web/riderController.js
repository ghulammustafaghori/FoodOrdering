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
let insertRider = async (req, res) => {
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
        let rider = new riderModel({
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
            live_location: {  // Add live location with default null values
                latitude: latitude || null,
                longitude: longitude || null,
                last_updated: null
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




let updateRider = async (req, res) => {
    let { id } = req.params;
    let { name, phone, vehicle_type, vehicle_number, account_holder_name, account_number, iban, bank_name, password, retypePassword, ratings, availability, completed_orders, joining_date, address } = req.body;

    try {
        let updateObj = {
            name,
            phone,
            vehicle_type,
            vehicle_number,
            account_holder_name,
            account_number,
            iban,
            bank_name,
            password,
            retypePassword,
            ratings,
            availability,
            completed_orders,
            joining_date
        };

        // 1️⃣ Check if address is provided in the update request
        if (address) {
            let latitude = null;
            let longitude = null;

            // 2️⃣ Call Nominatim API to get coordinates from address
            const geoResponse = await axios.get(`https://nominatim.openstreetmap.org/search`, {
                params: {
                    q: address, // User-provided address
                    format: "json",
                    limit: 1
                }
            });

            // 3️⃣ If address not found, log a warning and skip coordinates update
            if (geoResponse.data.length > 0) {
                // 4️⃣ Extract latitude & longitude from API response
                let location = geoResponse.data[0];
                latitude = parseFloat(location.lat);
                longitude = parseFloat(location.lon);
                console.log("📍 Coordinates fetched:", latitude, longitude);

                // 5️⃣ Add address details to the update object
                updateObj.address = {
                    text: address,  // Store user-entered address as text
                    latitude: latitude,
                    longitude: longitude
                };
            } else {
                console.warn("⚠️ Address not found! Saving without coordinates.");
                updateObj.address = { text: address }; // Save only text address
            }
        }

        // 6️⃣ Update the rider
        let updatedRider = await riderModel.findByIdAndUpdate(id, updateObj, { new: true });

        // 7️⃣ If rider not found, return error
        if (!updatedRider) {
            return res.status(404).send({
                status: 0,
                message: "Rider not found"
            });
        }

        // 8️⃣ Send response
        res.send({
            status: 1,
            message: "Rider updated successfully",
            data: updatedRider
        });
    } catch (error) {
        console.error("Error updating rider:", error.message);
        console.error("Stack trace:", error.stack); // This gives detailed error info

        res.status(500).send({
            status: 0,
            message: "Internal server error",
            error: error.message, // Send error message in response
        });
    }
};



let deleteRider=async(req,res)=>{
    let {id}=req.params;
    let rider=await riderModel.deleteOne({_id:id});
    res.send({
        status:1,
        message:"deleted successfully"
    })
}


let updateRiderLocation = async (req, res) => {
    let { id } = req.params;
    let { latitude, longitude } = req.body;

    try {
        // 1️⃣ Check if latitude and longitude are provided
        if (!latitude || !longitude) {
            return res.status(400).send({
                status: 0,
                message: "Latitude and Longitude are required"
            });
        }

        // 2️⃣ Update the rider's live location
        let updatedRider = await riderModel.findByIdAndUpdate(id, {
            live_location: {
                latitude,
                longitude,
                last_updated: Date.now()
            }
        }, { new: true });

        // 3️⃣ If rider not found, return error
        if (!updatedRider) {
            return res.status(404).send({
                status: 0,
                message: "Rider not found"
            });
        }

        // 4️⃣ Send response
        res.send({
            status: 1,
            message: "Rider's live location updated successfully",
            data: updatedRider
        });
    } catch (error) {
        console.error("Error updating rider location:", error.message);
        console.error("Stack trace:", error.stack); // This gives detailed error info

        res.status(500).send({
            status: 0,
            message: "Internal server error",
            error: error.message, // Send error message in response
        });
    }
};




module.exports={riderList,insertRider,updateRider,deleteRider,updateRiderLocation}