require('dotenv').config();
const express= require('express');
const app=express();
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
const cors=require('cors');
const searchRestaurantRoutes = require('./routes/web/searchRestaurantRoutes');
mongoose.connect(process.env.DB_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tls: true
}).then(()=>{
    console.log("DB Connected");
})




app.use(session({
    secret: process.env.SESSION_SECRET || "mysecret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
    cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 } // 1-hour session
}));





app.use(cors({
    origin: "http://localhost:3000", // Allow frontend to access API
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());


app.use('/uploads', express.static('uploads'));



// Authentication Routes
app.post("/web/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Users.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        req.session.userId = user._id; // Store user ID in session
        res.json({ message: "Login successful", userId: user._id });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

app.get("/web/api/session", (req, res) => {
    if (req.session.userId) {
        res.json({ loggedIn: true, userId: req.session.userId });
    } else {
        res.json({ loggedIn: false });
    }
});

app.post("/web/api/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ message: "Logout failed" });
        res.json({ message: "Logged out successfully" });
    });
});




app.use('/web/api/users',userRoutes);
app.use('/web/api/restaurants',restaurantRoutes);
app.use('/web/api/riders',riderRoutes)
app.use('/web/api/menus',menuRoutes)
app.use('/web/api/deals',dealRoutes)
app.use('/web/api',searchRestaurantRoutes);

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
})

