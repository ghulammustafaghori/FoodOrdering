const orderModel = require("../../models/order.model");
const userModel = require("../../models/user.model");
const restaurantModel = require("../../models/restaurant.model");
let orderList = async (req, res) => {
  const orders = await orderModel.find().populate("userId").populate("restaurantId");
  res.send({
    status: 1,
    message: "Orders fetched successfully",
    data: orders,
  });
};
let insertOrder = async (req, res) => {
  let { userId, restaurantId, items, totalPrice } = req.body;
  let order = new orderModel({
    userId,
    restaurantId,
    items,
    totalPrice,
  });
  await order.save();
      // 2️⃣ Increment total orders for user
      await User.findByIdAndUpdate(userId, { $inc: { totalOrders: 1 } });

      // 3️⃣ Increment total orders for restaurant
      await Restaurant.findByIdAndUpdate(restaurantId, { $inc: { totalOrders: 1 } });
      // 4️⃣ increase the total sales of restaurant
    //   await Restaurant.findByIdAndUpdate(restaurantId, { $inc: { totalSales: totalPrice } });
  
  res.send({
    status: 1,
    message: "Order inserted successfully",
    data: order,
  });
};
module.exports = { orderList, insertOrder };