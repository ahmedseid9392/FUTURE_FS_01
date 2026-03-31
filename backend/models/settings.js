import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  siteTitle: { type: String, default: "My Portfolio" },
  logo: String,
  cv: String,

  theme: { type: String, default: "light" },

  seoTitle: String,
  seoDescription: String,

  sections: {
    skills: { type: Boolean, default: true },
    projects: { type: Boolean, default: true },
    about: { type: Boolean, default: true }
  },

  lastLogin: Date
}, { timestamps: true });

export default mongoose.model("Settings", settingsSchema);