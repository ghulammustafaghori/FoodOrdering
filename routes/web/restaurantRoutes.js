const express=require('express');
const { restaurantList, insertRestaurant } = require('../../controllers/web/restaurantController');
const restaurantRoutes=express.Router();

restaurantRoutes.get('/restaurant-list',restaurantList);
restaurantRoutes.post('/insert-restaurant',insertRestaurant);

module.exports=restaurantRoutes;