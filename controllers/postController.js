const {Router}=require('express')

const router=Router()

const redis=require('../config/redis')

const Post=require('../models/postModel')

router.post('',async(req,res)=>{
    try{
        const post=await Post.create(req.body)
        redis.get('posts',async(err,posts)=>{
            if(err) console.error(error)    
            if(posts){
                const parsepost=JSON.parse(posts)
                const newpost=[...parsepost,posts]
                redis.set('posts',JSON.stringify(newpost))
            }else{
                const posts=await Post.find().lean().exec()
                const newpost=JSON.parse(posts)
                redis.set('posts',JSON.stringify(newpost))
            }
        })
        return res.send(post)
    }catch(err){
        return res.status(500).send(err.message)
    }
})

router.get('',async(req,res)=>{
    try{
        redis.get('posts',async(err,posts)=>{
            if(err) console.error(error)
            if(posts){          
            const allposts=JSON.parse(posts)
                return res.send({posts:allposts,redis:true})
                
            }else{
                const posts=await Post.find().lean().exec()
                redis.set('posts',JSON.stringify(posts))
                return res.send({posts:posts,redis:false})
            }   
        })
    }catch(err){
        return res.status(500).send(err.message)
    }
})

router.get('/:id',async(req,res)=>{
    try{
        redis.get(`post${req.params.id}`,async(err,post)=>{
            if(err) console.error(error)
            if(post){
                const fetchedpost=JSON.parse(post)
                return res.send({post:fetchedpost,redis:true})
            }else{
              try{
                const post=await Post.findById(req.params.id).lean().exec()
                redis.set(`post${req.params.id}`,JSON.stringify(post))
                return res.send({post:post,redis:false})
              }catch(err){
                  console.log(err)
              }
            }
        })
    }catch(err){
        return res.status(500).send(err.message)
    }
})

router.patch('/:id',async(req,res)=>{
    try{
        const post=await Post.findByIdAndUpdate(req.params.id,req.body,{new:true}).lean().exec()
        redis.set(`post${req.params.id}`,JSON.stringify(post))
        const posts=await Post.find().lean().exec()
        redis.set('posts',JSON.stringify(posts))
        return res.send(post)
    }catch(err){
        return res.status(500).send(err.message)
    }
})

router.delete('/:id',async(req,res)=>{
    try{
       const post=await Post.findByIdAndDelete(req.params.id).lean().exec()
       redis.del(`post${req.params.id}`)
       const posts=await Post.find().lean().exec()
       redis.set('posts',JSON.stringify(posts))
       return res.send(post)
    }catch(err){
        return res.status(500).send(err.message)
    }
})

router.post('/:id/likes',async(req,res)=>{
    try{
        redis.get(`post.${req.params.id}.likes`,async(err,postlikes)=>{
            if(err) console.log(err)
           const post=await Post.findById(req.params.id).lean().exec()
            if(postlikes){
                redis.incr(`post.${req.params.id}.likes`)
                post.likes=+postlikes+1
                return res.send({post,redis:true})
            }else{
                postlikes=1
                redis.set(`post.${req.params.id}.likes`,postlikes)
                post.likes=postlikes
                return res.send({post:post,redis:false})
            }
        })

    }catch(err){
        return res.status(500).send(err.message)
    }
})

module.exports=router

