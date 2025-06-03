const Project = require('../models/Project');
const cloudinary = require('../cloudinary/cloudinaryConfig');

const createProject = async (req, res) => {
  try {
    const { title, description, status, category } = req.body;
    let imageUrl = "";

    if (req.file) {
      // Upload to Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'projects' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      imageUrl = uploadResult.secure_url;
    }

    const newProject = new Project({
      title,
      description,
      image: imageUrl,
      status: status || 'ongoing',
      category,
    });

    const saved = await newProject.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ msg: 'Error creating project', error: err.message });
  }
  console.log('BODY:', req.body);
console.log('FILE:', req.file);
};

const getProjects = async (req, res) => {
  try {
    const filter = req.query.category ? { category: req.query.category } : {};
    const projects = await Project.find(filter).sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching projects', error: err.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ msg: 'Error updating project', error: err.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Error deleting project', error: err.message });
  }
};

module.exports = {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
};