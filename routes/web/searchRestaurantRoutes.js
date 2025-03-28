const express=require('express');
const {searchRestaurant}=require('../../controllers/web/searchRestaurantController');
const searchRestaurantRoutes=express.Router();

searchRestaurantRoutes.get('/search-restaurant/:value',searchRestaurant);
module.exports=searchRestaurantRoutes;