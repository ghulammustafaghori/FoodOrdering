const express=require('express')
let {pendingRiderList,pendingInsertRider, pendingDeleteRider,approvePendingRider}=require('../../controllers/web/pendingRiderController')

const pendingRiderRoutes=express.Router();



pendingRiderRoutes.get('/pendingRider-list',pendingRiderList)
pendingRiderRoutes.post('/insertPending-rider',pendingInsertRider)
pendingRiderRoutes.delete('/deletePending-rider/:id',pendingDeleteRider)
pendingRiderRoutes.post('/approvePending-rider/:id',approvePendingRider);



module.exports=pendingRiderRoutes;