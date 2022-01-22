const express=require('express')

const app=express()

const postController=require('./controllers/postController')

app.use(express.json())

 app.use('/post',postController)

module.exports=app