const express=require('express');
const { pendingRestaurantList, insertPendingRestaurant, pendingRestaurantUpdate, pendingRestaurantDelete,fileUpload } = require('../../controllers/web/pendingRestaurantController');
const pendingRestaurantRoutes=express.Router();

pendingRestaurantRoutes.get('/pendingRestaurant-list',pendingRestaurantList);
pendingRestaurantRoutes.post('/insert-pendingRestaurant',fileUpload,insertPendingRestaurant);
pendingRestaurantRoutes.put('/update-pendingRestaurant/:id',pendingRestaurantUpdate);
pendingRestaurantRoutes.delete('/delete-pendingRestaurant/:id',pendingRestaurantDelete);

module.exports=pendingRestaurantRoutes;