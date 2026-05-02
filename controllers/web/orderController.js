const orderModel = require("../../models/order.model");
const userModel = require("../../models/user.model");
const restaurantModel = require("../../models/restaurant.model");
const riderModel = require("../../models/rider.model");
const sendSMS=require('../../helper/smsService');
const qzatPushPayment = require('../../helper/payment');






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

    // 1. Fetch user
    const user = await userModel.findById(userId);
    if (!user || !user.address) {
      return res.status(404).json({ status: 0, message: "User or address not found" });
    }

    // 2. Fetch restaurant
    const restaurant = await restaurantModel.findById(restaurantId);
    if (!restaurant || !restaurant.address || !restaurant.location || !restaurant.location.coordinates) {
      return res.status(404).json({ status: 0, message: "Restaurant or location data missing" });
    }

    const [restaurantLng, restaurantLat] = restaurant.location.coordinates;

    // 3. Fetch available riders
    const riders = await riderModel.find({
      availability: 'available',
      'live_location.latitude': { $ne: null },
      'live_location.longitude': { $ne: null }
    });

    if (!riders || riders.length === 0) {
      return res.status(404).json({ status: 0, message: "No available riders found" });
    }

    // 4. Find nearest rider
    let nearestRider = null;
    let shortestDistance = Infinity;

    for (let rider of riders) {
      if (rider.live_location?.latitude && rider.live_location?.longitude) {
        const distance = haversineDistance(
          restaurantLat,
          restaurantLng,
          rider.live_location.latitude,
          rider.live_location.longitude
        );
        if (distance < shortestDistance) {
          shortestDistance = distance;
          nearestRider = rider;
        }
      }
    }

    if (!nearestRider) {
      return res.status(404).json({ status: 0, message: "No available riders with a live location found" });
    }

    // 5. Prepare and save order
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

    const order = new orderModel(orderData);
    await order.save();

    // 6. Populate order data
    const populatedOrder = await orderModel.findById(order._id)
      .populate('items.menuItemId')
      .populate('riderId');

    // 7. Prepare phone number
    const rawPhone = String(user.phone || "").replace(/\D/g, "");
    const phone = rawPhone.startsWith("255") ? rawPhone : `255${rawPhone.slice(-9)}`;

    // 8. Trigger Q-Zat Payment
    const { paymentChannel } = req.body; // get it from frontend

    const paymentResult = await qzatPushPayment({
      channel: paymentChannel || "Tigo", // default to Tigo if nothing sent
      phone_number: phone,
      amount: totalPrice,
      fname: user.name.split(" ")[0] || "Customer",
      lname: user.name.split(" ")[1] || "",
      payment_id: `pay_${Date.now()}_${user._id}`
    });

    console.log("💳 Q-Zat Payment Response:", paymentResult);

    if (!paymentResult.success) {
      console.error("❌ Payment failed:", paymentResult.error);
      return res.status(500).json({
        status: 0,
        message: "Payment initiation failed",
        error: paymentResult.error
      });
    }

    // 9. Send SMS
    const message = `Dear ${user.name || "Customer"}, your order has been successfully placed. Thank you for choosing us!`;
    const smsResult = await sendSMS({ to: phone, text: message });

    if (!smsResult.success) {
      console.error("SMS failed:", smsResult.error);
    }

    // 10. Final response
    res.send({
      status: 1,
      message: "Order placed, payment initiated, and SMS sent",
      data: populatedOrder,
      payment: paymentResult.data
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 0, message: "Something went wrong" });
  }
};




module.exports = { orderList, insertOrder };