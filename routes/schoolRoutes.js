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
router.post("/api/addSchool", authMiddleware, asyncHandler(addSchool));
router.get("/api/listSchools", authMiddleware, asyncHandler(listSchools));
router.put("/api/schools/:id", authMiddleware, asyncHandler(updateSchool));
router.delete("/api/schools/:id", authMiddleware, asyncHandler(deleteSchool));

export default router;
