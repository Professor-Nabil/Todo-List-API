import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: string;
  email: string;
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET || "fallback-secret-key";
    const payload = jwt.verify(token, secret) as JwtPayload;

    req.user = {
      id: payload.id,
      email: payload.email,
    };

    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};
