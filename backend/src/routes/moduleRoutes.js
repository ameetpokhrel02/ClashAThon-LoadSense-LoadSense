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
router.post("/", protect, createModule);

// Get all modules
router.get("/", protect, getAllModules);

// Get, Update, and Delete a single module by ID
router
  .route("/:id")
  .get(protect, getModuleById)
  .patch(protect, updateModule)      // This is the update route
  .delete(protect, deleteModule);  // This is the delete rou

// Get a single module by ID
router.get("/:id", protect, getModuleById);


// Update a module by ID
router.patch("/:id", protect, updateModule);

// Delete a module by ID
router.delete("/:id", protect, deleteModule);

export default router;