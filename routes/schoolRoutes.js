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

// Assignment-required endpoints
router.post("/addSchool", asyncHandler(addSchool));
router.get("/listSchools", asyncHandler(listSchools));

// Existing authenticated CRUD endpoints
router.post("/api/schools", authMiddleware, asyncHandler(addSchool));
router.get("/api/schools", authMiddleware, asyncHandler(listSchools));
router.put("/api/schools/:id", authMiddleware, asyncHandler(updateSchool));
router.delete("/api/schools/:id", authMiddleware, asyncHandler(deleteSchool));

export default router;
