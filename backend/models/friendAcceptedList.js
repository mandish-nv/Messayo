const mongoose=require('mongoose')

const friendListSchema =new mongoose.Schema({
  user:{
    type:String,
    required:true
  },
  friendList:{
    type:Array,
    required:true
  }
}, {timestamps: true})

module.exports = mongoose.model("friendAcceptedList.js", friendListSchema);