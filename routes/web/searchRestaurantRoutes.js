const express=require('express');
const {searchRestaurant}=require('../../controllers/web/searchRestaurantController');
const searchRestaurantRoutes=express.Router();

searchRestaurantRoutes.get('/search-restaurant/:latitude/:longitude',searchRestaurant);
module.exports=searchRestaurantRoutes;