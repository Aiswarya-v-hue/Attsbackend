
const bcrypt = require('bcryptjs')
const {Schema,model}=require('mongoose')
const signupschema = new Schema({
name:{type:String,required:true},
email:{type:String,required:true,unique:true},
password:{type:String,required:true}
})
//hash the password before saving
signupschema.pre('save',async function(next){
    //if the password is not modified return to next 
if(!this.isModified('password'))
    return next();
//if modified bcrypt the password 
this.password =  await bcrypt.hash(this.password,10)
next();
})


module.exports = model('signups',signupschema)