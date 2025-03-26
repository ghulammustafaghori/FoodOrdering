const express=require('express')
let {riderList,insertRider, updateRider, deleteRider}=require('../../controllers/web/riderController')

const riderRoutes=express.Router();



riderRoutes.get('/rider-list',riderList)
riderRoutes.post('/insert-rider',insertRider)
riderRoutes.put('/update-rider/:id',updateRider)
riderRoutes.delete('/delete-rider/:id',deleteRider)



module.exports=riderRoutes;