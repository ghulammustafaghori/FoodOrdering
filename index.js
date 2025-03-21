require('dotenv').config();
const express= require('express');
const app=express();
const mongoose=require('mongoose');
const Users=require('./models/user.model');
const { userList } = require('./controllers/web/userController');
const userRoutes = require('./routes/web/userRoutes');
mongoose.connect(process.env.DB_URL,{
    tls: true
}).then(()=>{
    console.log("DB Connected");
})
app.use(express.json());
app.use('/web/api/users',userRoutes);

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
})

