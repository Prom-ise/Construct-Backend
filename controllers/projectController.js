const Project = require('../models/Project');
const cloudinary = require('../cloudinary/cloudinaryConfig');
const { sendProjectCompletionEmail } = require('../utils/sendEmail');

const createProject = async (req, res) => {
  try {
    const { title, description, status, category, clientName, email } = req.body; // <-- add clientName, email
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
      clientName, // <-- save clientName
      email      // <-- save email
    });

    const saved = await newProject.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Project save error:', err);
    res.status(400).json({ msg: 'Error creating project', error: err.message, details: err.errors });
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

    // Send completion email if status is set to "completed"
    if (updated && req.body.status === "completed") {
      // Make sure your Project model has 'email' and 'title' fields
      await sendProjectCompletionEmail({
        name: updated.title || "Client", // or updated.name if you store client name
        email: updated.email,            // make sure you store client email in the project
        projectType: updated.category    // or updated.projectType if you have that field
      });
    }

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