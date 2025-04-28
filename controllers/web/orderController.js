const orderModel = require("../../models/order.model");
const userModel = require("../../models/user.model");
const restaurantModel = require("../../models/restaurant.model");
let orderList = async (req, res) => {
  const orders = await orderModel.find().populate("userId").populate("restaurantId").populate("items.menuItemId");
  res.send({
    status: 1,
    message: "Orders fetched successfully",
    data: orders,
  });
  //  console.log(orders);
};
let insertOrder = async (req, res) => {
  let { userId, restaurantId, items, totalPrice } = req.body;
  
  // Create a new order
  let order = new orderModel({
    userId,
    restaurantId,
    items,
    totalPrice,
  });

  // Save the order
  await order.save();

  // Increment total orders for the user
  // await userModel.findByIdAndUpdate(userId, { $inc: { orders: 1 } });

  // Increment total orders and sales for the restaurant
  // await restaurantModel.findByIdAndUpdate(restaurantId, { $inc: { orders: 1, totalSales: totalPrice } });

  // Populate item details like name, itemId, etc.
  const populatedOrder = await orderModel.findById(order._id)
    .populate('items.menuItemId'); // Assuming items are populated based on itemId

  res.send({
    status: 1,
    message: "Order inserted successfully",
    data: populatedOrder,
  });
};

module.exports = { orderList, insertOrder };