require('./Database/Dbconfig')
const express = require('express');
const app=express();
const port=process.env.PORT||10000;
const cors = require('cors')
const path = require('path')


const corsOptions = {
    origin: "https://eloquent-shortbread-05525d.netlify.app", // Replace with your actual Netlify URL
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Allow cookies if needed
    allowedHeaders: "Content-Type,Authorization"
  };
  app.use(cors(corsOptions));


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

