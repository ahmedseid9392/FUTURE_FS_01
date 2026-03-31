import Profile from "../models/profile.js";

// GET all profiles
export const getProfiles = async (req,res)=>{
 const profiles = await Profile.find().sort({createdAt:-1});
 res.json(profiles);
};

// CREATE
export const createProfile = async (req,res)=>{
 const profile = new Profile(req.body);
 await profile.save();
 res.json(profile);
};

// UPDATE
export const updateProfile = async (req,res)=>{
 const profile = await Profile.findByIdAndUpdate(
  req.params.id,
  req.body,
  {new:true}
 );
 res.json(profile);
};

// DELETE
export const deleteProfile = async (req,res)=>{
 await Profile.findByIdAndDelete(req.params.id);
 res.json({message:"Deleted"});
};

// SET ACTIVE PROFILE
export const setActiveProfile = async (req,res)=>{

 try{

  // remove active from all
  await Profile.updateMany({}, { isActive:false });

  // set selected as active
  const profile = await Profile.findByIdAndUpdate(
   req.params.id,
   { isActive:true },
   { new:true }
  );

  res.json(profile);

 }catch(err){
  res.status(500).json({message:err.message});
 }

};


