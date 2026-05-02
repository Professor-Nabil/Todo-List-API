import { Router } from "express";
import { authenticateToken } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  createTodo,
  updateTodo,
  deleteTodo,
  getTodos,
  createTodoSchema,
  updateTodoSchema,
} from "../controllers/todoController.js";

const router = Router();

// Protect all todo endpoints
router.use(authenticateToken);

router.post("/", validate(createTodoSchema), createTodo);
router.get("/", getTodos);
router.put("/:id", validate(updateTodoSchema), updateTodo);
router.delete("/:id", deleteTodo);

export default router;
