// routes/upload.js - Add this endpoint
import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { uploadImage } from "../controllers/uploadController.js";
import protectAdmin from "../middleware/authMiddleware.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

router.post("/", protectAdmin, upload.single("image"), uploadImage);

// Add this endpoint to make existing files public
router.post("/make-public/:publicId", protectAdmin, async (req, res) => {
  try {
    const { publicId } = req.params;
    
    // Update the file to public access mode
    const result = await cloudinary.api.update(publicId, {
      access_mode: 'public',
      resource_type: 'auto'
    });
    
    res.json({
      success: true,
      message: "File is now public",
      url: cloudinary.url(publicId, { secure: true, access_mode: 'public' })
    });
  } catch (error) {
    console.error("Error making file public:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
// Add this endpoint to your backend
router.get("/get-cv/:profileId", protectAdmin, async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.profileId);
    if (!profile || !profile.cv) {
      return res.status(404).json({ error: "CV not found" });
    }
    
    // Generate a signed URL for the CV
    const publicId = profile.cv.split('/').pop().split('.')[0];
    const signedUrl = cloudinary.url(publicId, {
      resource_type: 'raw',
      secure: true,
      sign_url: true,
      type: 'authenticated' // This creates a signed URL
    });
    
    res.json({ url: signedUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;