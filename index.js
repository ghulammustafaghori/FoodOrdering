require('dotenv').config();
const express= require('express');
const app=express();
const mongoose=require('mongoose');
const Users=require('./models/user.model');
const { userList } = require('./controllers/web/userController');
const userRoutes = require('./routes/web/userRoutes');
mongoose.connect(process.env.DB_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tls: true
}).then(()=>{
    console.log("DB Connected");
})

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
})
app.use('/web/api/users',userRoutes);