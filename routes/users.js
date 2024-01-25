const mongoose=require('mongoose')
const plm =require('passport-local-mongoose')
const URI=process.env.URI
mongoose.connect(URI)

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
