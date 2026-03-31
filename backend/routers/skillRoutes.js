import express from "express";
import {
  getSkills,
  createSkill,
  deleteSkill,
  updateSkill
} from "../controllers/skillController.js";



import protectAdmin from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getSkills);

router.post("/", protectAdmin, createSkill);

router.delete("/:id", protectAdmin, deleteSkill);
router.put("/:id", protectAdmin, updateSkill);

export default router;