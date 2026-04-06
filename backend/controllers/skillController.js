import Skill from "../models/skill.js";

export const getSkills = async (req, res) => {

  const skills = await Skill.find();

  res.json(skills);

};

export const createSkill = async (req,res)=>{

 try{

  const { name, description, icon, category, experience } = req.body;

 
  const skill = new Skill({
   name,
   description,
   icon,
   category,
   experience
  });

  await skill.save();

  res.status(201).json(skill);

 }catch(err){

  res.status(500).json({message:err.message});

 }

};

export const updateSkill = async (req, res) => {
 try {

  const { name, description, icon, category, experience } = req.body;

  const skill = await Skill.findById(req.params.id);

  if (!skill) {
   return res.status(404).json({ message: "Skill not found" });
  }

  // update fields
  skill.name = name || skill.name;
  skill.description = description || skill.description;
  skill.icon = icon || skill.icon;
  skill.category = category || skill.category;
  skill.experience = experience || skill.experience;

  await skill.save();

  res.json(skill);

 } catch (err) {
  res.status(500).json({ message: err.message });
 }
};
export const deleteSkill = async (req, res) => {

  await Skill.findByIdAndDelete(req.params.id);

  res.json({ message: "Skill deleted" });

};