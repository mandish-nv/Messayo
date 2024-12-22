const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')

const app=express()
const URL='mongodb://localhost:27017/Dokoto'
app.use(express.json())
app.use(cors())

mongoose.connect(URL,{useNewUrlParser:true})
    .then(()=>{
        app.get('/',(req,res)=>{
            res.send('Mongo Connected')
        })

        app.listen(5000)
    })
    .catch(err=>console.log(err))
