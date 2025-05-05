const express= require('express');
const orderRoutes= express.Router();
const {orderList,insertOrder}=require('../../controllers/web/orderController');

console.log("📂 orderRoutes.js loaded");


orderRoutes.post('/test', (req, res) => {
    console.log("✅ Test route hit!");
    res.send({ status: 1, message: "Test success" });
  });
  // Add this at the top of your route file

orderRoutes.get('/order-list',orderList);
orderRoutes.post('/insert-order',insertOrder);
module.exports=orderRoutes;