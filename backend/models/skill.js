import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({

 name:String,

 description:String,

 icon:String,

 category:String,

 experience:String

});

export default mongoose.model("Skill",skillSchema);