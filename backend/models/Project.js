import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  github: String,
  demo: String
}, { timestamps: true });

const Project = mongoose.model("Project", projectSchema);

export default Project;
