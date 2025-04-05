const mongoose=require('mongoose');
const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
    items: [{ name: String, price: Number, quantity: Number }],
    totalPrice: Number,
    createdAt: { type: Date, default: Date.now },
  });
  let orderModel = mongoose.model("Order", orderSchema);
  module.exports = orderModel;

  