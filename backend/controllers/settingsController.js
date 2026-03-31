import Settings from "../models/settings.js";
import Admin from "../models/Admin.js";

// GET settings


export const getSettings = async (req, res) => {
  let settings = await Settings.findOne();

  if (!settings) {
    settings = await Settings.create({
      siteTitle: "My Portfolio",
      logo: "",
      cv: "",
      seo: {
        title: "",
        description: ""
      },
      sections: {
        skills: true,
        projects: true,
        about: true
      }
    });
  }

  res.json(settings);
};

// UPDATE settings
export const updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings(req.body);
    } else {
      Object.assign(settings, req.body);
    }

    await settings.save();

    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const changePassword = async (req,res)=>{
 try{

  const { currentPassword, newPassword } = req.body;

  const admin = await Admin.findById(req.user.id);

  const isMatch = await bcrypt.compare(currentPassword, admin.password);

  if(!isMatch){
   return res.status(400).json({message:"Wrong password"});
  }

  const salt = await bcrypt.genSalt(10);
  admin.password = await bcrypt.hash(newPassword,salt);

  await admin.save();

  res.json({message:"Password updated"});

 }catch(err){
  res.status(500).json({message:err.message});
 }
};





