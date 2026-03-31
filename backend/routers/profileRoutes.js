import express from "express";
import {
 getProfiles,
 createProfile,
 updateProfile,
 deleteProfile,
 setActiveProfile
} from "../controllers/profileController.js";

const router = express.Router();

router.get("/", getProfiles);
router.post("/", createProfile);
router.put("/:id", updateProfile);
router.delete("/:id", deleteProfile);
router.put("/active/:id", setActiveProfile);

export default router;