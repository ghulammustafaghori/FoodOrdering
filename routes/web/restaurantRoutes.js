const express=require('express');
const { restaurantList, insertRestaurant, restaurantUpdate, restaurantDelete,fileUpload } = require('../../controllers/web/restaurantController');
const restaurantRoutes=express.Router();

restaurantRoutes.get('/restaurant-list',restaurantList);
restaurantRoutes.post('/insert-restaurant',fileUpload,insertRestaurant);
restaurantRoutes.put('/update-restaurant/:id',fileUpload,restaurantUpdate);
restaurantRoutes.delete('/delete-restaurant/:id',restaurantDelete);

module.exports=restaurantRoutes;