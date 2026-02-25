import express from "express";
import {
  createModule,
  getAllModules,
  getModuleById,
  updateModule,
  deleteModule
} from "../controllers/moduleController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

// Create a new module
// router.post("/", protect, createModule);
router.post("/", protect, createModule);

// Get all modules (with optional query filters like ?semester=4)
router.get("/", protect, getAllModules);


// Get a single module by ID
router.get("/:id", protect, getModuleById);

export default router;