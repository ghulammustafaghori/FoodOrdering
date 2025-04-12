const express=require('express');
const { featureRestaurantList, insertFeatureRestaurant, featureRestaurantDelete,fileUpload,featureExistingRestaurant } = require('../../controllers/web/featureRestaurantController');
const featureRestaurantRoutes=express.Router();

featureRestaurantRoutes.get('/featureRestaurant-list',featureRestaurantList);
featureRestaurantRoutes.post('/feature-existingRestaurant/:id',featureExistingRestaurant);
featureRestaurantRoutes.post('/insert-featureRestaurant/:id',fileUpload,insertFeatureRestaurant);
// featureRestaurantRoutes.put('/update-restaurant/:id',restaurantUpdate);
featureRestaurantRoutes.delete('/delete-featureRestaurant/:id',featureRestaurantDelete);

module.exports=featureRestaurantRoutes;