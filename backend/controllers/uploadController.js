
export const uploadImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded"
      });
    }

    // Log the file info for debugging
    console.log("File uploaded:", {
      path: req.file.path,
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    res.status(200).json({
      message: "File uploaded successfully",
      imageUrl: req.file.path // This is the Cloudinary URL
    });

  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      message: error.message || "Upload failed"
    });
  }
};