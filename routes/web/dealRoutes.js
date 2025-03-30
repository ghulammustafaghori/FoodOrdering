const {readDeal,insertDeal,updateDeal,deleteDeal,fileUpload}=require('../../controllers/web/dealController');
const express=require('express');
const dealRoutes=express.Router();
dealRoutes.get('/deal-list',readDeal);
dealRoutes.post('/insert-deal',fileUpload,insertDeal);
dealRoutes.put('/update-deal/:id',updateDeal);
dealRoutes.delete('/delete-deal/:id',deleteDeal);
module.exports=dealRoutes;