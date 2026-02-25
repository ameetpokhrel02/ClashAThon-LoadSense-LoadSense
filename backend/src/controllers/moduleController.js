import Module from '../models/Module.js';
import mongoose from 'mongoose';

// Create a new module
export const createModule = async (req, res) => {
  try {
    const { moduleCode, title, department, credits, semester, year } = req.body;

    // Required field validation
    if (!moduleCode || !title || !department || !credits || !semester || !year) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Data type validation
    if (typeof credits !== "number" || typeof semester !== "number" || typeof year !== "number") {
      return res.status(400).json({
        success: false,
        message: "Credits, semester, and year must be numbers"
      });
    }

    // Range validation
    if (credits <= 0 ) {
      return res.status(400).json({
        success: false,
        message: "Credits cannot be negative"
      });
    }
    if (semester < 1 || semester > 12) {
      return res.status(400).json({
        success: false,
        message: "Semester must be between 1 and 12"
      });
    }
    if (year < 1 || year > 4) {
      return res.status(400).json({
        success: false,
        message: "Year must be between 1 and 4"
      });
    }

    // Duplicate moduleCode check for this user only
    const existingModule = await Module.findOne({ moduleCode, user: req.user.id });
    if (existingModule) {
      return res.status(409).json({
        success: false,
        message: "You already have a module with this code"
      });
    }

    const newModule = new Module({
      moduleCode,
      title,
      department,
      credits,
      semester,
      year,
      user: req.user.id  // associate module with logged-in user
    });

    const savedModule = await newModule.save();

    res.status(201).json({
      success: true,
      data: savedModule
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all modules for logged-in user
export const getAllModules = async (req, res) => {
  try {
    const filters = req.query || {};

    // Always filter by user
    const modules = await Module.find({ user: req.user.id, ...filters })
      .sort({ semester: 1, moduleCode: 1 });

    res.status(200).json({
      success: true,
      count: modules.length,
      data: modules
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

// Get a single module by ID (only if owned by the user)
export const getModuleById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid module ID format"
      });
    }

    const module = await Module.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found or not accessible"
      });
    }

    res.status(200).json({
      success: true,
      data: module
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

// Update a module by ID (only if owned by the user)
export const updateModule = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid module ID format"
      });
    }

    const module = await Module.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found or not accessible"
      });
    }

    const { moduleCode, title, department, credits, semester, year } = req.body;

    // Required field validation
    if (!moduleCode || !title || !department || !credits || !semester || !year) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }
    // Data type validation
    if (typeof credits !== "number" || typeof semester !== "number" || typeof year !== "number") {
      return res.status(400).json({
        success: false,
        message: "Credits, semester, and year must be numbers"
      });
    }
    // Range validation
    if (credits < 1 ) {
      return res.status(400).json({
        success: false,
        message: "Credits must be greater than 1"
      });
    }
    if (semester < 1 || semester > 12) {
      return res.status(400).json({
        success: false,
        message: "Semester must be between 1 and 12"
      });
    }
    if (year < 1 || year > 4) {
      return res.status(400).json({
        success: false,
        message: "Year must be between 1 and 4"
      });
    }

    // Duplicate moduleCode check for this user (excluding current module)
    const existingModule = await Module.findOne({ moduleCode, user: req.user._id, _id: { $ne: req.params.id } });
    if (existingModule) {
      return res.status(409).json({
        success: false,
        message: "You already have a module with this code"
      });
    }

    module.moduleCode = moduleCode;
    module.title = title;
    module.department = department;
    module.credits = credits;
    module.semester = semester;
    module.year = year;
    await module.save();

    res.status(200).json({
      success: true,
      message: "Module updated successfully",
      data: module
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete a module by ID (only if owned by the user)
export const deleteModule = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid module ID format"
      });
    }

    const module = await Module.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });
    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found or not accessible"
      });
    }

    res.status(200).json({
      success: true,
      message: "Module deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};