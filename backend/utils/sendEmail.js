import nodemailer from "nodemailer";

export const sendEmail = async ({ name, email, subject, message }) => {

 const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
   user: process.env.EMAIL_USER,
   pass: process.env.EMAIL_PASS
  }
 });

 // send to YOU
 await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: process.env.EMAIL_USER,
  subject: subject,
  html: `
   <h3>New Contact Message</h3>
   <p><b>Name:</b> ${name}</p>
   <p><b>Email:</b> ${email}</p>
   <p>${message}</p>
  `
 });

 //  AUTO REPLY TO USER
 await transporter.sendMail({
  to: email,
  subject: "We received your message",
  html: `
   <h3>Hi ${name},</h3>
   <p>Thanks for contacting me. I’ll reply soon.</p>
  `
 });
};