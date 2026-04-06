import mongoose from "mongoose";

const socialSchema = new mongoose.Schema({

 name:String,
 url:String,
 icon:String 

},{timestamps:true});

export default mongoose.model("Social",socialSchema);