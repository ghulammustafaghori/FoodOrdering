const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "restaurant" },
  riderId: { type: mongoose.Schema.Types.ObjectId, ref: "rider" },

  items: [
    {
      menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: "menu" },
      quantity: Number,
      price: Number
    }
  ],
  totalPrice: Number,

  // 👇 Add these two fields
  userAddress: {
    text: String,
    latitude: Number,
    longitude: Number
  },
  restaurantAddress: {
    text: String,
    latitude: Number,
    longitude: Number
  },

  createdAt: { type: Date, default: Date.now },
});

const orderModel = mongoose.model("Order", orderSchema);
module.exports = orderModel;
