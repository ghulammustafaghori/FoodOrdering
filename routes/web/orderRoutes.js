const express= require('express');
const orderRoutes= express.Router();
const {orderList,insertOrder}=require('../../controllers/web/orderController');
orderRoutes.get('/order-list',orderList);
orderRoutes.post('/insert-order',insertOrder);
module.exports=orderRoutes;