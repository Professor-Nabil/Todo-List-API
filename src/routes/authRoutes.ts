import { Router } from "express";
import {
  registerUser,
  loginUser,
  registerSchema,
  loginSchema,
} from "../controllers/authController.js";
import { validate } from "../middleware/validate.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = Router();

// Apply strict rate limiting to auth endpoints
router.post("/register", authLimiter, validate(registerSchema), registerUser);
router.post("/login", authLimiter, validate(loginSchema), loginUser);

export default router;
