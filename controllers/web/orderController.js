const orderModel = require("../../models/order.model");
const userModel = require("../../models/user.model");
const restaurantModel = require("../../models/restaurant.model");
const riderModel = require("../../models/rider.model");





let orderList = async (req, res) => {
  const orders = await orderModel.find().populate("userId").populate("restaurantId").populate("items.menuItemId");
  res.send({
    status: 1,
    message: "Orders fetched successfully",
    data: orders,
  });
  //  console.log(orders);
};


// Haversine formula to calculate distance between two coordinates
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};


  let insertOrder = async (req, res) => {
    console.log("🔥 insertOrder hit!");
  
  
  try {
    const { userId, restaurantId, items, totalPrice } = req.body;

    // Fetch user data
    const user = await userModel.findById(userId);
    if (!user || !user.address) {
      return res.status(404).json({ status: 0, message: "User or address not found" });
    }

    // Fetch restaurant data
    const restaurant = await restaurantModel.findById(restaurantId);
    if (!restaurant || !restaurant.address) {
      return res.status(404).json({ status: 0, message: "Restaurant or address not found" });
    }

    // Fetch available riders
    const riders = await riderModel.find({ availability: 'available' });

    if (!riders || riders.length === 0) {
      return res.status(404).json({ status: 0, message: "No available riders found" });
    }

    let nearestRider = null;
    let shortestDistance = Infinity;

    // Loop through each rider and calculate the distance to the restaurant
    for (let rider of riders) {
      if (rider.live_location.latitude && rider.live_location.longitude) {
        const distance = haversineDistance(
          restaurant.address.latitude,
          restaurant.address.longitude,
          rider.live_location.latitude,
          rider.live_location.longitude
        );

        if (distance < shortestDistance) {
          shortestDistance = distance;
          nearestRider = rider;
        }
      }
    }

    // If no rider was found, return an error
    if (!nearestRider) {
      return res.status(404).json({ status: 0, message: "No available riders with a live location found" });
    }

    // Prepare order data
    const orderData = {
      userId,
      restaurantId,
      items,
      totalPrice,
      userAddress: {
        text: user.address.text,
        latitude: user.address.latitude,
        longitude: user.address.longitude
      },
      restaurantAddress: {
        text: restaurant.address.text,
        latitude: restaurant.address.latitude,
        longitude: restaurant.address.longitude
      },
      riderId: nearestRider._id, // Assign the nearest rider
    };

    // Save the order
    const order = new orderModel(orderData);
    await order.save();

    // Optionally update rider stats here...

    // Populate menu items and rider data
    const populatedOrder = await orderModel.findById(order._id)
      .populate('items.menuItemId')
      .populate('riderId'); // Populate rider details

    res.send({
      status: 1,
      message: "Order inserted successfully",
      data: populatedOrder,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 0, message: "Something went wrong" });
  }}




module.exports = { orderList, insertOrder };