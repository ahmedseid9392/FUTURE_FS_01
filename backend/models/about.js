import mongoose from "mongoose";

const educationSchema = new mongoose.Schema({
 title:String,
 school:String,
 year:String,
 description:String
});

const experienceSchema = new mongoose.Schema({
 role:String,
 company:String,
 year:String,
 description:String
});

const aboutSchema = new mongoose.Schema({

 aboutText:String,

 education:[educationSchema],

 experience:[experienceSchema]

},{timestamps:true});

export default mongoose.model("About",aboutSchema);