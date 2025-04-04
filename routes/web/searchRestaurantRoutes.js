const express=require('express');
const {searchRestaurant}=require('../../controllers/web/searchRestaurantController');
const searchRestaurantRoutes=express.Router();

searchRestaurantRoutes.get('/search-restaurant/:value/:userId',searchRestaurant);
module.exports=searchRestaurantRoutes;