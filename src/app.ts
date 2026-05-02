import express from "express";
import { apiLimiter } from "./middleware/rateLimiter.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";

const app = express();

// 1. Core global middleware
app.use(express.json());

// 2. Global rate limiter for standard endpoints
app.use(apiLimiter);

// 3. Routing Layer
app.use(authRoutes);
app.use("/todos", todoRoutes);

// 4. Global Error Management (Must be placed after all routes)
app.use(errorHandler);

export default app;
