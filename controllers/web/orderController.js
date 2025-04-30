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
const insertOrder = async (req, res) => {
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
      }
    };

    // Save the order
    const order = new orderModel(orderData);
    await order.save();

    // Optionally update user/restaurant stats here...

    // Populate menu items
    const populatedOrder = await orderModel.findById(order._id)
      .populate('items.menuItemId');

    res.send({
      status: 1,
      message: "Order inserted successfully",
      data: populatedOrder,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 0, message: "Something went wrong" });
  }
};


module.exports = { orderList, insertOrder };