import express from "express";
import {
 getAbout,
 updateAbout,
 addEducation,
 deleteEducation,
 addExperience,
 deleteExperience,
 updateEducation,
 updateExperience
 
} from "../controllers/aboutController.js";

const router = express.Router();

router.get("/",getAbout);

router.put("/",updateAbout);

router.post("/education",addEducation);
router.delete("/education/:id",deleteEducation);

router.post("/experience",addExperience);
router.delete("/experience/:id",deleteExperience);
router.put("/education/:id", updateEducation);
router.put("/experience/:id", updateExperience);

export default router;