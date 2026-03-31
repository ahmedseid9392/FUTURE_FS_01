import Project from "../models/Project.js";

export const getProjects = async (req, res) => {
  try {

    const projects = await Project.find().sort({ createdAt: -1 });

    res.json(projects);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }
};

export const createProject = async (req, res) => {

  try {

    const { title, description, image, github, demo } = req.body;

    const project = new Project({
      title,
      description,
      image,
      github,
      demo
    });

    await project.save();

    res.status(201).json(project);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};

export const updateProject = async (req, res) => {

  try {

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(project);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};

export const deleteProject = async (req, res) => {

  try {

    await Project.findByIdAndDelete(req.params.id);

    res.json({ message: "Project deleted" });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};