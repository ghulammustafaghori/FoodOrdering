require('dotenv').config();
const express= require('express');
const app=express();
const axios = require('axios');
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bcrypt = require("bcryptjs");
const mongoose=require('mongoose');
const Users=require('./models/user.model');
const userRoutes = require('./routes/web/userRoutes');
const restaurantRoutes = require('./routes/web/restaurantRoutes');
const riderRoutes = require('./routes/web/riderRoutes');
const menuRoutes = require('./routes/web/menuRoutes');
const dealRoutes = require('./routes/web/dealRoutes');
const orderRoutes = require('./routes/web/orderRoutes');
const featureRestaurantRoutes = require('./routes/web/featureRestaurantRoutes');
const cors=require('cors');
const searchRestaurantRoutes = require('./routes/web/searchRestaurantRoutes');
const adminRoutes = require('./routes/admin/adminRoutes');
const pendingRestaurantRoutes = require('./routes/web/pendingRestaurantRoutes');
mongoose.connect(process.env.DB_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tls: true
}).then(()=>{
    console.log("DB Connected");
})



app.use(cors({
    origin: "http://localhost:3000", // Allow frontend to access API
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());


app.use('/uploads', express.static('uploads'));



app.use('/web/api/users',userRoutes);
app.use('/web/api/restaurants',restaurantRoutes);
app.use('/web/api/pendingRestaurants',pendingRestaurantRoutes);
app.use('/web/api/riders',riderRoutes)
app.use('/web/api/menus',menuRoutes)
app.use('/web/api/deals',dealRoutes)
app.use('/web/api',searchRestaurantRoutes);
app.use('/web/api/featureRestaurants',featureRestaurantRoutes);
app.use('/web/api/checkout',orderRoutes);
app.use('/web/api/admin',adminRoutes);


app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
})