import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, getUserByEmail } from "../services/userService.js";

// Validation Schemas
export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
  }),
});

const generateToken = (userId: string, email: string) => {
  const secret = process.env.JWT_SECRET || "fallback-secret-key";
  return jwt.sign({ id: userId, email }, secret, { expiresIn: "1d" });
};

/**
 * POST /register
 */
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      res.status(400).json({ error: "Email already registered" });
      return;
    }

    const newUser = await createUser({ name, email, password });
    const token = generateToken(newUser.id, newUser.email);

    res.status(201).json({ token });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /login
 */
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await getUserByEmail(email);
    if (!user) {
      res.status(400).json({ error: "Invalid email or password" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(400).json({ error: "Invalid email or password" });
      return;
    }

    const token = generateToken(user.id, user.email);
    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};
