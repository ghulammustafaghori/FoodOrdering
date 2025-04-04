const restaurantModel = require('../../models/restaurant.model');
const userModel = require('../../models/user.model');

const searchRestaurant = async (req, res) => {
    try {
        let searchValue = req.params.value;
        let userId = req.params.userId; // Assuming user ID is passed

        // Fetch user location
        const user = await userModel.findById(userId);
        if (!user || !user.address || !user.address.latitude || !user.address.longitude) {
            return res.status(404).json({ message: "User location not found" });
        }

        let { latitude, longitude } = user.address; // Get user coordinates

        // ✅ Find nearby restaurants within 10km (10,000 meters)
        let result = await restaurantModel.find({
            name: { $regex: searchValue, $options: "i" },
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [longitude, latitude]
                    },
                    $maxDistance: 10000 // 10 km in meters
                }
            }
        });

        res.send(result);
    } catch (error) {
        console.error("Error searching for restaurants:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { searchRestaurant };
