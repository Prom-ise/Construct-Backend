const mongoose = require('mongoose');
const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    status: {
      type: String,
      enum: ['ongoing', 'completed'],
      default: 'ongoing',
    },
    category: {
      type: String,
      enum: ['Building from Scratch', 'Plan and Layouts', 'Completing', 'Evaluation', 'Drainage', 'Road', 'Shops, malls,mart, complexes', 'Bridges', 'Warehouses', 'Pens and farmhouses'],
      required: true,
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model('Project', projectSchema);