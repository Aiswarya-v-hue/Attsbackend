const {Router}= require('express')
const route=Router();
const {user,userlogin,getUser}= require('../Controllers/signupController')

route.post('/create',user)
route.post('/login',userlogin)
route.get('/getuser',getUser)
module.exports=route;
