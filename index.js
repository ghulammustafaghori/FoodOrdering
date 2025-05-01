require('dotenv').config();
const express= require('express');
const app=express();
const {createServer} = require('http');
const server = createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
// const axios = require('axios');
// const session = require("express-session");
// const MongoStore = require("connect-mongo");
const bcrypt = require("bcryptjs");
const mongoose=require('mongoose');
// const Users=require('./models/user.model');
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
const pendingRiderRoutes = require('./routes/web/pendingRiderRoutes');
mongoose.connect(process.env.DB_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tls: true
}).then(()=>{
    console.log("DB Connected");
})



app.use(cors({
    origin: ["http://localhost:3000",
    "https://zygomorphic-marcille-foodordering-b159eacd.koyeb.app" ],// Allow frontend to access API
    methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Explicit OPTIONS handler
app.options('*', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.status(204).send();
  });

app.use(express.json());

// This middleware will allow the OPTIONS method for preflight requests
app.options('*', cors());


const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Add timeout middleware (place this before your routes)
app.use((req, res, next) => {
    req.setTimeout(10000, () => {
      res.status(504).json({ status: 0, message: 'Request timeout' });
    });
    next();
  });


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
app.use('/web/api/pendingRiders',pendingRiderRoutes);


// Error handling middleware (add this after all routes)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
      status: 0,
      message: 'Internal Server Error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  });

  const riderModel = require("./models/rider.model"); // adjust path

io.on("connection", (socket) => {
    console.log("🟢 Rider connected:", socket.id);

    socket.on("locationUpdate", async ({ riderId, latitude, longitude }) => {
        try {
            await riderModel.findByIdAndUpdate(riderId, {
                live_location: {
                    latitude,
                    longitude,
                    last_updated: new Date()
                }
            });
            console.log(`📍 Updated location for rider ${riderId}`);
        } catch (err) {
            console.error("❌ Error updating rider location:", err.message);
        }
    });

    socket.on("disconnect", () => {
        console.log("🔴 Rider disconnected:", socket.id);
    });
});


server.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
})