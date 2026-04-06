import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routers/authRoutes.js";
import adminRoutes from "./routers/adminRoutes.js";
import contactRoutes from "./routers/contactRoutes.js";
import uploadRoutes from "./routers/uploadRoutes.js";
import projectRoutes from "./routers/projectRoutes.js";
import skillRoutes from "./routers/skillRoutes.js";
import profileRoutes from "./routers/profileRoutes.js";
import aboutRoutes from "./routers/aboutRoutes.js";
import socialRoutes from "./routers/socialRoutes.js";
import settingsRoutes from "./routers/settingsRoutes.js";




dotenv.config();

const app = express();
connectDB();

app.use(express.json());


// Correct CORS configuration
app.use(cors({
  origin: [
    'https://ahmedseidali.vercel.app',  
    'https://my-react-portfolio-wine.vercel.app', 
    'http://localhost:5173' 
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));



app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact",contactRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/socials",socialRoutes);
app.use("/api", settingsRoutes);


app.use("/api/about", aboutRoutes);



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
