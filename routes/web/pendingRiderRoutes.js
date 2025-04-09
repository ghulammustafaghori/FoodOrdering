const express=require('express')
let {pendingRiderList,pendingInsertRider, pendingDeleteRider}=require('../../controllers/web/pendingRiderController')

const pendingRiderRoutes=express.Router();



pendingRiderRoutes.get('/pendingRider-list',pendingRiderList)
pendingRiderRoutes.post('/insertPending-rider',pendingInsertRider)
pendingRiderRoutes.delete('/deletePending-rider/:id',pendingDeleteRider)



module.exports=pendingRiderRoutes;