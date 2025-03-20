const express = require('express');
const userRoutes=express.Router();
const { userList } = require('../../controllers/web/userController');
userRoutes.get('/user-list', userList);
module.exports=userRoutes;