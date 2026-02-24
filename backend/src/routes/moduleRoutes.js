import express from "express";
import {
  createModule,
  getAllModules,
  getModuleById
} from "../controllers/moduleController.js";

const router = express.Router();

// Create a new module
router.post("/", createModule);

// Get all modules (with optional query filters like ?semester=4)
router.get("/", getAllModules);

// Get a single module by ID
router.get("/:id", getModuleById);

export default router;