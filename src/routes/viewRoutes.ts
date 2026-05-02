import { Router, Request, Response } from "express";

const router = Router();

// Render the landing/home page
router.get("/", (req: Request, res: Response) => {
  res.render("home", { title: "Home - Todo App" });
});

export default router;
