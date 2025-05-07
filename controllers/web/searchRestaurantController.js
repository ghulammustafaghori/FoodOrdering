const restaurantModel = require('../../models/restaurant.model');

const searchRestaurant = async (req, res) => {
    try {
        const { latitude, longitude } = req.params;

        if (!latitude || !longitude) {
            return res.status(400).json({ message: "Latitude and longitude are required" });
        }

        // Convert to numbers (important!)
        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);

        if (isNaN(lat) || isNaN(lng)) {
            return res.status(400).json({ message: "Invalid coordinates" });
        }

        // Find restaurants within 10km
        const result = await restaurantModel.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [lng, lat]
                    },
                    $maxDistance: 10000 // 10 km
                }
            }
        });

        res.json(result);
    } catch (error) {
        console.error("Error searching for restaurants:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { searchRestaurant };
