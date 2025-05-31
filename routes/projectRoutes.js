const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { authenticateUser, isAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload'); // Assuming you export the multer configuration

// Create a new project (admin only)
// router.post(
//   '/add',
//   authenticateUser,
//   isAdmin,
//   upload.single('image'),
//   async (req, res) => {
//     const { title, description, status, category } = req.body;
//     const imageUrl = `/uploads/${req.file.filename}`; // saved file path

//     try {
//       const newProject = new Project({
//         title,
//         description,
//         image: imageUrl,
//         status: status || 'ongoing',
//         category,
//       });

//       await newProject.save();
//       res.status(201).json(newProject);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   }
// );

const { createProject } = require('../controllers/projectController');

router.post(
  '/add',
  authenticateUser,
  isAdmin,
  upload.single('image'),
  createProject, 
);

router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authenticateUser, isAdmin, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/status', authenticateUser, isAdmin, async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ msg: 'Error updating status', error: err.message });
  }
});
module.exports = router;
