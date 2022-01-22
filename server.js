const connect=require('./config/db')

const app=require('./app')

app.listen(5555,async()=>{
    await connect()
    console.log('listening port 5555')
})