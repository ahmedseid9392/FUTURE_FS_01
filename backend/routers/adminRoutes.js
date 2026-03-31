import express from "express";
import protectAdmin from "../middleware/authMiddleware.js";


const router = express.Router();

router.get("/dashboard", protectAdmin, (req, res) => {
  res.json({
    message: "Welcome Admin",
    admin: req.admin
  });
});



export default router;