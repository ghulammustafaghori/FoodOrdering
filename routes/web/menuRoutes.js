const {readMenu,insertMenu,updateMenu,deleteMenu}=require('../../controllers/web/menuController');
const express=require('express');
const menuRoutes=express.Router();
menuRoutes.get('/menu-list',readMenu);
menuRoutes.post('/insert-menu',insertMenu);
menuRoutes.put('/update-menu/:id',updateMenu);
menuRoutes.delete('/delete-menu/:id',deleteMenu);
module.exports=menuRoutes;