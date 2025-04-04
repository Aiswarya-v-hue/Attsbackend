const mongoose = require('mongoose'); 
const {Schema,model}=require('mongoose')

const productschema = new Schema({

name:{type:String,required:true},
price:{type:Number,required:true},
stock:{type:Number,required:true},
description:{type:String,required:true},
category:{type:String,required:true},
manufacturingDate:{type:Date,required:true},
image:{type:String,required:true},
createdBy:{type:mongoose.Schema.Types.ObjectId,ref:'signups',required:true},

},
{
    timestamps:true
})
module.exports = model('product',productschema)