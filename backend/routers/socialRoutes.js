import express from "express";
import {
 getSocials,
 createSocial,
 updateSocial,
 deleteSocial
} from "../controllers/socialController.js";

const router = express.Router();

router.get("/",getSocials);
router.post("/",createSocial);
router.put("/:id",updateSocial);
router.delete("/:id",deleteSocial);

export default router;