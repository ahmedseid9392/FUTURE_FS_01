import About from "../models/about.js";

// GET about text
export const getAbout = async(req,res)=>{

 let about = await About.findOne();

 if(!about){
  about = await About.create({aboutText:""});
 }

 res.json(about);
};

// UPDATE ABOUT TEXT
export const updateAbout = async(req,res)=>{

 const about = await About.findOneAndUpdate(
  {},
  {aboutText:req.body.aboutText},
  {new:true,upsert:true}
 );

 res.json(about);
};

// ADD EDUCATION
export const addEducation = async(req,res)=>{

 const about = await About.findOne();

 about.education.push(req.body);

 await about.save();

 res.json(about);
};

// DELETE EDUCATION
export const deleteEducation = async(req,res)=>{

 const about = await About.findOne();

 about.education = about.education.filter(
  edu => edu._id.toString() !== req.params.id
 );

 await about.save();

 res.json(about);
};

export const updateEducation = async (req, res) => {
 try {

  const { title, school, year, description } = req.body;

  const about = await About.findOne();

  const edu = about.education.id(req.params.id);

  if (!edu) {
   return res.status(404).json({ message: "Education not found" });
  }

  // update fields
  edu.title = title || edu.title;
  edu.school = school || edu.school;
  edu.year = year || edu.year;
  edu.description = description || edu.description;

  await about.save();

  res.json(about);

 } catch (err) {
  res.status(500).json({ message: err.message });
 }
};

// ADD EXPERIENCE
export const addExperience = async(req,res)=>{

 const about = await About.findOne();

 about.experience.push(req.body);

 await about.save();

 res.json(about);
};

// DELETE EXPERIENCE
export const deleteExperience = async(req,res)=>{

 const about = await About.findOne();

 about.experience = about.experience.filter(
  exp => exp._id.toString() !== req.params.id
 );

 await about.save();

 res.json(about);
};

export const updateExperience = async (req, res) => {
 try {

  const { role, company, year, description } = req.body;

  const about = await About.findOne();

  const exp = about.experience.id(req.params.id);

  if (!exp) {
   return res.status(404).json({ message: "Experience not found" });
  }

  // update fields
  exp.role = role || exp.role;
  exp.company = company || exp.company;
  exp.year = year || exp.year;
  exp.description = description || exp.description;

  await about.save();

  res.json(about);

 } catch (err) {
  res.status(500).json({ message: err.message });
 }
};