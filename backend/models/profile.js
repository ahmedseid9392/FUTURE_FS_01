import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({

 name:String,

 title:String,

 bio:String,

 image:String,

 cv:String ,
   
isActive:{
  type:Boolean,
  default:false
 }

},{timestamps:true});

export default mongoose.model("Profile",profileSchema);