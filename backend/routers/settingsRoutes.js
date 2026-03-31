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

// router.delete("/delete-admin/:id", protectAdmin, deleteAdmin);
// router.post("/logout-all", protectAdmin, logoutAll);

export default router;