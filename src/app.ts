import express from "express";
import path from "path";
import expressLayouts from "express-ejs-layouts";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import { apiLimiter } from "./middleware/rateLimiter.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import viewRoutes from "./routes/viewRoutes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure EJS Templating
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", "layouts/main");

// 1. Core global middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 2. Global rate limiter for standard endpoints
app.use(apiLimiter);

// 3. View & API Routes Layer
app.use(viewRoutes); // Mount view routes first so it matches "/" correctly
app.use(authRoutes);
app.use("/todos", todoRoutes);

// 4. Global Error Management
app.use(errorHandler);

export default app;
