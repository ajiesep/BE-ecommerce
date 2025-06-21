import express from "express";
import {
  protectedMiddleware,
  adminMiddleware,
} from "../middlewares/authMiddleware.js";
import {
  CreateBook,
  AllBook,
  DetailBook,
  CurrentUserBook,
  callbackPayment,
} from "../controllers/BookController.js";

const router = express.Router();

// post /api/v1/order
// cuman diakses oleh user auth
router.post("/", protectedMiddleware, CreateBook);

// get /api/v1/order
// cuman diakses oleh user role admin
router.get("/", protectedMiddleware, adminMiddleware, AllBook);

// get /api/v1/order/:id
// cuman diakses oleh user role admin
router.get("/:id", protectedMiddleware, adminMiddleware, DetailBook);

// get /api/v1/order/current/user
// cuman diakses oleh user auth
router.get("/current/user", protectedMiddleware, CurrentUserBook);

// post /api/v1/order/callback/midtrans
router.post("/current/midtrans", callbackPayment);

export default router;
