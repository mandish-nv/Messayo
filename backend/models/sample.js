const mongoose = require('mongoose');   

const sampleSchema = mongoose.Schema({  
    message:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    },
},{timestamps:true})

const Sample=mongoose.model('Sample',sampleSchema)
module.exports=Sample