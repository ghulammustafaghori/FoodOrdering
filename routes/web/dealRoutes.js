const {readDeal,insertDeal,updateDeal,deleteDeal}=require('../../controllers/web/dealController');
const express=require('express');
const dealRoutes=express.Router();
dealRoutes.get('/deal-list',readDeal);
dealRoutes.post('/insert-deal',insertDeal);
dealRoutes.put('/update-deal/:id',updateDeal);
dealRoutes.delete('/delete-deal/:id',deleteDeal);
module.exports=dealRoutes;