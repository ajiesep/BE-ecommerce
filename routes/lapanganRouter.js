import express from "express";
import {
  protectedMiddleware,
  adminMiddleware,
} from "../middlewares/authMiddleware.js";
import {
  CreateLapangan,
  AllLapangan,
  detailLapangan,
  updateLapangan,
  deleteLapangan,
  FileUpload,
} from "../controllers/LapanganController.js";
import { upload } from "../utils/uploadFileHandler.js";

const router = express.Router();

// CRUD Lapangan
// Create data lapangan
// post /api/v1/lapangan/create
// middleware owner

router.post("/", protectedMiddleware, adminMiddleware, CreateLapangan);

// Read data lapangan
// get /api/v1/lapangan/create
router.get("/", AllLapangan);

// Detail data lapangan
// get /api/v1/lapangan/:id
router.get("/:id", detailLapangan);

// Update data lapangan
// put /api/v1/lapangan/:id
// middleware owner
router.put("/:id", protectedMiddleware, adminMiddleware, updateLapangan);

// Delete data lapangan
// delete /api/v1/lapangan/:id
// middleware owner
router.delete("/:id", protectedMiddleware, adminMiddleware, deleteLapangan);

// File Update data lapangan
// post /api/v1/lapangan/file-upload
// middleware owner
router.post(
  "/file-upload",
  protectedMiddleware,
  adminMiddleware,
  upload.single("image"),
  FileUpload
);

export default router;
