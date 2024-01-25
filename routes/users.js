const mongoose=require('mongoose')
require('dotenv').config();
const plm =require('passport-local-mongoose')
const uri=process.env.uri;
mongoose.connect(uri)
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const userSchema=mongoose.Schema({
  username:{type:String,required:true},
  email:{type:String,required:true},
  password:{type:String},
  fullname:{type:String,required:true},
  profileImage:{type:String},
  posts:[{type:mongoose.Schema.Types.ObjectId,
  ref:"posts"}],
  bio:{type:String}
  
})

userSchema.plugin(plm)
module.exports=mongoose.model("users",userSchema)
