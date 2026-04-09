import express from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  addSchool,
  listSchools,
  updateSchool,
  deleteSchool,
} from "../controllers/schoolController.js";

const router = express.Router();



// Existing authenticated CRUD endpoints
router.post("/addSchool", authMiddleware, asyncHandler(addSchool));
router.get("/listSchools", authMiddleware, asyncHandler(listSchools));
router.put("/schools/:id", authMiddleware, asyncHandler(updateSchool));
router.delete("/schools/:id", authMiddleware, asyncHandler(deleteSchool));

export default router;
