import express from "express";
import {
  protectedMiddleware,
  adminMiddleware,
} from "../middlewares/authMiddleware.js";
import {
  CreateProduct,
  AllProduct,
  detailProduct,
  updateProduct,
  deleteProduct,
  FileUpload,
} from "../controllers/ProductController.js";
import { upload } from "../utils/uploadFileHandler.js";

const router = express.Router();

// CRUD Product
// Create data product
// post /api/v1/product/create
// middleware owner

router.post("/", protectedMiddleware, adminMiddleware, CreateProduct);

// Read data product
// get /api/v1/product/create
router.get("/", AllProduct);

// Detail data product
// get /api/v1/product/:id
router.get("/:id", detailProduct);

// Update data product
// put /api/v1/product/:id
// middleware owner
router.put("/:id", protectedMiddleware, adminMiddleware, updateProduct);

// Delete data product
// delete /api/v1/product/:id
// middleware owner
router.delete("/:id", protectedMiddleware, adminMiddleware, deleteProduct);

// File Update data product
// post /api/v1/product/file-upload
// middleware owner
router.post(
  "/file-upload",
  protectedMiddleware,
  adminMiddleware,
  upload.single("image"),
  FileUpload
);

export default router;
