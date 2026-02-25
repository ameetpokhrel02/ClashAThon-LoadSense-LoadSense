import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema({
  moduleCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    required: true
  },
  credits: {
    type: Number,
    required: true,
    default: 3
  },
  semester: {
    type: Number,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  }
}, { timestamps: true });

// Optional compound index for fast filtering by user + semester
moduleSchema.index({ user: 1, semester: 1 });

const Module = mongoose.model('Module', moduleSchema);
export default Module;