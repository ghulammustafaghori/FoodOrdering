const express = require('express');
const userRoutes=express.Router();
const { userList, insertUser } = require('../../controllers/web/userController');
userRoutes.get('/user-list', userList);
userRoutes.post('/insert-user',insertUser);
module.exports=userRoutes;