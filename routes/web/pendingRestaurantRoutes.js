const express=require('express');
const { pendingRestaurantList, insertPendingRestaurant, pendingRestaurantUpdate, pendingRestaurantDelete,approvePendingRestaurant,fileUpload } = require('../../controllers/web/pendingRestaurantController');
const pendingRestaurantRoutes=express.Router();
pendingRestaurantRoutes.get('/pendingRestaurant-list',pendingRestaurantList);
pendingRestaurantRoutes.post('/insert-pendingRestaurant',fileUpload,insertPendingRestaurant);
pendingRestaurantRoutes.put('/update-pendingRestaurant/:id',fileUpload,pendingRestaurantUpdate);
pendingRestaurantRoutes.delete('/delete-pendingRestaurant/:id',pendingRestaurantDelete);
pendingRestaurantRoutes.post('/approve/:id', approvePendingRestaurant);

module.exports=pendingRestaurantRoutes;