import express from "express";
import {
  getSettings,
  updateSettings,
  changePassword
} from "../controllers/settingsController.js";
import protectAdmin from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getSettings);
router.put("/", protectAdmin, updateSettings);
router.post("/change-password", protectAdmin, changePassword);


export default router;