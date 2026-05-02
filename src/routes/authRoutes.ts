import { Router } from "express";
import {
  registerUser,
  loginUser,
  registerSchema,
  loginSchema,
} from "../controllers/authController.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.post("/register", validate(registerSchema), registerUser);
router.post("/login", validate(loginSchema), loginUser);

export default router;
