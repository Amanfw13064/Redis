const mongoose=require('mongoose')

const postSchema=new mongoose.Schema({
    title:{type:String,required:true},
    body:{type:String,required:true},
    likes:{type:Number,required:true,default:0},
},{
    versionkey:false,
    timestamp:true,
})

module.exports=mongoose.model('post',postSchema)