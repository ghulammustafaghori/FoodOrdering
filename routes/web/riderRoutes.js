const express=require('express')
let {riderList,insertRider, updateRider, deleteRider,updateRiderLocation}=require('../../controllers/web/riderController')

const riderRoutes=express.Router();



riderRoutes.get('/rider-list',riderList)
riderRoutes.post('/insert-rider',insertRider)
riderRoutes.put('/update-rider/:id',updateRider)
riderRoutes.delete('/delete-rider/:id',deleteRider)
// Route to update live location
riderRoutes.put('/riders/:id/location', updateRiderLocation);




module.exports=riderRoutes;