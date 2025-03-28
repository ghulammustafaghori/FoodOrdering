const userModel = require('../../models/user.model');
const axios=require('axios');
let userList= async(req,res)=>{
    const users=await userModel.find();
    res.send({
        status:1,
        message:"Users fetched successfully",
        data:users
    })
}
let insertUser= async(req,res)=>{
    let {name,phone,email,password,retypePassword,address,orders}=req.body;


    


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

        // 4️⃣ Save user with both text address & coordinates
        const user = new userModel({
            name,
            email,
            password,
            retypePassword,
            phone,
            address: { 
                text: address, // Store user-entered address as text
                latitude: latitude, 
                longitude: longitude
            },
            orders
        });
   await user.save();
    res.send({
        status:1,
        message:"User inserted successfully",
        data:user
    })
}
    catch (error) {
        console.error("Error inserting user:", error);
        res.status(500).send({
            status: 0,
            message: "Internal server error"
        });
    }
}

let updateUser = async (req, res) => {
    let userId = req.params.id;
    let { name, phone, email, password, retypePassword, address, orders } = req.body;

    try {
        let updateObj = {
            name,
            phone,
            email,
            password,
            retypePassword,
            orders
        };

        // 1️⃣ Check if address is provided in the update request
        if (address) {
            // 2️⃣ Call Nominatim API to get coordinates from address
            const geoResponse = await axios.get(`https://nominatim.openstreetmap.org/search`, {
                params: {
                    q: address, // User-provided address
                    format: "json",
                    limit: 1
                }
            });

            // 3️⃣ If address not found, return an error
            if (!geoResponse.data.length) {
                return res.status(400).send({
                    status: 0,
                    message: "Invalid address. Unable to fetch location coordinates."
                });
            }

            // 4️⃣ Extract latitude & longitude from API response
            let location = geoResponse.data[0];
            let latitude = parseFloat(location.lat);
            let longitude = parseFloat(location.lon);

            // 5️⃣ Add address details to the update object
            updateObj.address = {
                text: address,  // Store user-entered address as text
                latitude: latitude,
                longitude: longitude
            };
        }

        // 6️⃣ Update the user
        let updatedUser = await userModel.findByIdAndUpdate(userId, updateObj, { new: true });

        // 7️⃣ If user not found, return error
        if (!updatedUser) {
            return res.status(404).send({
                status: 0,
                message: "User not found"
            });
        }

        // 8️⃣ Send response
        res.send({
            status: 1,
            message: "User updated successfully",
            data: updatedUser
        });

    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send({
            status: 0,
            message: "Internal server error"
        });
    }
};



let deleteUser= async(req,res)=>{
    let userId=req.params.id;
    let deleteUser=await userModel.deleteOne({_id:userId});
    res.send({
        status:1,
        message:"User deleted successfully",
        data:deleteUser
    })
}
    
module.exports={userList,insertUser,updateUser,deleteUser};