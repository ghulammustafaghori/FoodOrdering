const restaurantModel = require('../../models/restaurant.model');

const searchRestaurant = async (req, res) => {
   let searchValue = req.params.value;
   let result = await restaurantModel.find({
      $or: [
         { "name": { $regex : searchValue, $options: "i"}}
      ]
   });
   res.send(result)
}

module.exports = { searchRestaurant };