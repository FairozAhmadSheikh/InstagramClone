const mongoose=require('mongoose')
const postSchema=mongoose.Schema({
   picture:String,
   caption:String,
   user:{
    type:mongoose.Schema.Types.ObjectId,
         ref:"users"
        },
    date:{
            type:Date,
    default:Date.now
     },
   likes:[
    {
        type:mongoose.Schema.Types.ObjectId,
             ref:"users"
            }
        ],

})
module.exports=mongoose.model("posts",postSchema)