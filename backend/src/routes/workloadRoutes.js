import express from "express";
import {
  calculateWorkload,
  getWorkload,
  getAlert,
} from "../controllers/workloadController.js";

const router = express.Router();

router.post("/calculate", calculateWorkload);
router.get("/", getWorkload);
router.get("/alert", getAlert);

export default router;