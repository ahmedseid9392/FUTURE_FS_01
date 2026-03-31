import express from "express";

import {
 getMessages,
 markAsRead,
 deleteMessage,
 replyMessage,
  createMessage  
} from "../controllers/contactController.js";

const router = express.Router();
router.post("/", createMessage);

router.get("/",getMessages);

router.put("/read/:id",markAsRead);

router.delete("/:id",deleteMessage);

router.post("/reply",replyMessage);

export default router;