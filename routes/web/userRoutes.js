const express = require('express');
const userRoutes=express.Router();
const { userList, insertUser, updateUser } = require('../../controllers/web/userController');
userRoutes.get('/user-list', userList);
userRoutes.post('/insert-user',insertUser);
userRoutes.put('/update-user/:id',updateUser);
module.exports=userRoutes;