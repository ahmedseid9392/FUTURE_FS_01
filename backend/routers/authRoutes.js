import express from "express";
import { loginAdmin
   
 } from "../controllers/authController.js";
 import { registerAdmin, changePassword } from "../controllers/authController.js";
import protectAdmin from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.post("/register-admin", protectAdmin, registerAdmin);

router.post("/change-password", protectAdmin, changePassword);


export default router;