import Social from "../models/social.js";

// GET ALL
export const getSocials = async(req,res)=>{
 const socials = await Social.find();
 res.json(socials);
};

// CREATE
export const createSocial = async(req,res)=>{
 const social = await Social.create(req.body);
 res.json(social);
};

// UPDATE
export const updateSocial = async(req,res)=>{
 const social = await Social.findByIdAndUpdate(
  req.params.id,
  req.body,
  { new:true }
 );
 res.json(social);
};

// DELETE
export const deleteSocial = async(req,res)=>{
 await Social.findByIdAndDelete(req.params.id);
 res.json({message:"Deleted"});
};