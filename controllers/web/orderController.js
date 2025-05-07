const orderModel = require("../../models/order.model");
const userModel = require("../../models/user.model");
const restaurantModel = require("../../models/restaurant.model");
const riderModel = require("../../models/rider.model");
const sendSMS=require('../../helper/smsService');





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

console.log("📦 orderController.js LOADED");

let insertOrder = async (req, res) => {
  try {
    const { userId, restaurantId, items, totalPrice } = req.body;

    // Fetch user data
    const user = await userModel.findById(userId);
    if (!user || !user.address) {
      return res.status(404).json({ status: 0, message: "User or address not found" });
    }

    // Fetch restaurant data
    const restaurant = await restaurantModel.findById(restaurantId);
    console.log('Restaurant Data:', restaurant);

    if (!restaurant || !restaurant.address || !restaurant.location || !restaurant.location.coordinates) {
      return res.status(404).json({ status: 0, message: "Restaurant or location data missing" });
    }

    const [restaurantLng, restaurantLat] = restaurant.location.coordinates;
    console.log(`Restaurant Lat/Lng: ${restaurantLat}, ${restaurantLng}`);

    // Fetch available riders
    const riders = await riderModel.find({
      availability: 'available',
      'live_location.latitude': { $ne: null },
      'live_location.longitude': { $ne: null }
    });

    if (!riders || riders.length === 0) {
      return res.status(404).json({ status: 0, message: "No available riders found" });
    }

    // Loop through each rider and calculate the distance to the restaurant
    let nearestRider = null;
    let shortestDistance = Infinity;

    for (let rider of riders) {
      console.log("Live Location Type Check:");
      console.log("Latitude:", rider.live_location.latitude, typeof rider.live_location.latitude);
      console.log("Longitude:", rider.live_location.longitude, typeof rider.live_location.longitude);

      // Check if rider has valid live location
      if (rider.live_location?.latitude && rider.live_location?.longitude) {
        const distance = haversineDistance(
          restaurantLat,
          restaurantLng,
          rider.live_location.latitude,
          rider.live_location.longitude
        );

        console.log(`Rider ID: ${rider._id}, Distance: ${distance} km`);

        if (distance < shortestDistance) {
          shortestDistance = distance;
          nearestRider = rider;
        }
      } else {
        console.log(`Rider ID: ${rider._id} does not have valid live location data.`);
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
        latitude: restaurantLat,
        longitude: restaurantLng
      },
      riderId: nearestRider._id,
    };

    // Log the order data before saving it
    console.log('Order Data:', orderData);

    // Save the order
    const order = new orderModel(orderData);
    await order.save();

    // Populate menu items and rider data
    const populatedOrder = await orderModel.findById(order._id)
      .populate('items.menuItemId')
      .populate('riderId');

      // Send SMS after order is saved
    const phone = user.phone.startsWith("255") ? user.phone : `255${user.phone.slice(-9)}`;
    const message = `Dear ${user.name || "Customer"}, your order has been successfully placed. Thank you for choosing us!`;

    console.log("⚡ Sending SMS to:", phone, "with message:", message);

    const smsResult = await sendSMS({ to: phone, text: message });

    console.log("📤 SMS result:", smsResult);


    if (smsResult.success) {
      console.log("SMS sent:", smsResult.data);
    } else {
      console.error("SMS failed:", smsResult.error);
    }

    res.send({
      status: 1,
      message: "Order placed and SMS sent successfully",
      data: populatedOrder,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 0, message: "Something went wrong" });
  }

  
};



module.exports = { orderList, insertOrder };