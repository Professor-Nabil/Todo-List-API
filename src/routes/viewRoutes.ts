import { Router, Request, Response } from "express";

const router = Router();

// Render the landing/home page
router.get("/", (req: Request, res: Response) => {
  res.render("home", { title: "Home - Todo App" });
});

// Render the register page
router.get("/register", (req: Request, res: Response) => {
  res.render("register", { title: "Register - Todo App" });
});

// Render the login page
router.get("/login", (req: Request, res: Response) => {
  res.render("login", { title: "Sign In - Todo App" });
});

// Render the authenticated dashboard view
router.get("/dashboard", (req: Request, res: Response) => {
  res.render("todos", { title: "Your Dashboard - Todo App" });
});

export default router;
