const mongoose=require('mongoose')

const friendPendingListSchema =new mongoose.Schema({
  user:{
    type:String,
    required:true
  },
  friendPendingList:{
    type:Array,
    required:true
  }
}, {timestamps: true})

module.exports = mongoose.model("friendPendingList", friendPendingListSchema);