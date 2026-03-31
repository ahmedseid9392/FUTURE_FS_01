import Contact from "../models/contact.js";
import nodemailer from "nodemailer";
import { sendEmail } from "../utils/sendEmail.js";

export const createMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // save to DB
    const newMessage = new Contact({
      name,
      email,
      subject,
      message
    });

    await newMessage.save();

    // send email
    await sendEmail({ name, email, subject, message });

    res.status(201).json({ message: "Message sent successfully" });

  } catch (err) {
    console.error("CONTACT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
// get all messages
export const getMessages = async(req,res)=>{

 const messages = await Contact.find().sort({createdAt:-1});

 res.json(messages);

};


// mark as read
export const markAsRead = async(req,res)=>{

 const message = await Contact.findByIdAndUpdate(
  req.params.id,
  {status:"read"},
  {new:true}
 );

 res.json(message);

};


// delete message
export const deleteMessage = async(req,res)=>{

 await Contact.findByIdAndDelete(req.params.id);

 res.json({message:"Deleted"});

};


// reply email
export const replyMessage = async(req,res)=>{

 const {email,reply} = req.body;

 const transporter = nodemailer.createTransport({

  service:"gmail",

  auth:{
   user:process.env.EMAIL_USER,
   pass:process.env.EMAIL_PASS
  }

 });

 await transporter.sendMail({

  from:process.env.EMAIL_USER,

  to:email,

  subject:"Reply from Portfolio",

  text:reply

 });

 res.json({message:"Reply sent"});

};