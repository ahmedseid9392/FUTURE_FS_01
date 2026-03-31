import mongoose from "mongoose";

const socialSchema = new mongoose.Schema({

 name:String,
 url:String,
 icon:String // ex: "fab fa-github"

},{timestamps:true});

export default mongoose.model("Social",socialSchema);