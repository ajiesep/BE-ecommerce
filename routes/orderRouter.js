import express from "express";
import {
  protectedMiddleware,
  adminMiddleware,
} from "../middlewares/authMiddleware.js";
import {
  CreateOrder,
  AllOrder,
  DetailOrder,
  CurrentUserOrder,
} from "../controllers/OrderController.js";

const router = express.Router();

// post /api/v1/order
// cuman diakses oleh user auth
router.post("/", protectedMiddleware, CreateOrder);

// get /api/v1/order
// cuman diakses oleh user role admin
router.get("/", protectedMiddleware, adminMiddleware, AllOrder);

// get /api/v1/order/:id
// cuman diakses oleh user role admin
router.get("/:id", protectedMiddleware, adminMiddleware, DetailOrder);

// get /api/v1/order/current/user
// cuman diakses oleh user auth
router.get("/current/user", protectedMiddleware, CurrentUserOrder);

export default router;
