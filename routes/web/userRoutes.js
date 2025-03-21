const express = require('express');
const userRoutes=express.Router();
const { userList, insertUser, updateUser, deleteUser } = require('../../controllers/web/userController');



userRoutes.get('/user-list', userList);
userRoutes.post('/insert-user',insertUser);
userRoutes.put('/update-user/:id',updateUser);
userRoutes.delete('/delete-user/:id',deleteUser);



module.exports=userRoutes;