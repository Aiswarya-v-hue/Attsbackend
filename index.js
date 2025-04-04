require('./Database/Dbconfig')
const express = require('express');
const app=express();
const port=process.env.PORT||5000;
const cors = require('cors')
const path = require('path')
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],  
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}));
app.use(express.json())
app.use(express.urlencoded({extended:false}))

const productRoutes = require('./Routers/productRoute')
const auth = require('./Middleware/authMiddleware')
app.use('/uploads',express.static(path.join(__dirname,'uploads')));
app.use('/api/auth',auth,productRoutes);
app.use('/api',require('./Routers/signupRouter'))
app.use('/api',require('./Routers/productRoute'))
app.listen(port,()=>{
    console.log(`listening at port ${port}`);
    
})

