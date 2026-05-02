import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import * as todoService from "../services/todoService.js";

// Validation Schemas
export const createTodoSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
  }),
});

export const updateTodoSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title cannot be empty").optional(),
    description: z.string().min(1, "Description cannot be empty").optional(),
  }),
});

/**
 * POST /todos
 */
export const createTodo = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user!.id; // Guaranteed by the JWT auth middleware
    const { title, description } = req.body;

    const newTodo = await todoService.createTodo(userId, {
      title,
      description,
    });

    res.status(201).json({
      id: newTodo.id,
      title: newTodo.title,
      description: newTodo.description,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /todos/:id
 */
export const updateTodo = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user!.id;
    // Safely cast to string to prevent string[] type conflicts
    const paramId = String(req.params.id);
    const todoId = parseInt(paramId, 10);

    if (isNaN(todoId)) {
      res.status(400).json({ error: "Invalid ID format" });
      return;
    }

    const { title, description } = req.body;
    const updated = await todoService.updateTodo(todoId, userId, {
      title,
      description,
    });

    if (!updated) {
      res.status(404).json({ message: "Todo not found" });
      return;
    }

    res.status(200).json({
      id: updated.id,
      title: updated.title,
      description: updated.description,
    });
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Forbidden")) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }
    next(error);
  }
};

/**
 * DELETE /todos/:id
 */
export const deleteTodo = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user!.id;
    // Safely cast to string to prevent string[] type conflicts
    const paramId = String(req.params.id);
    const todoId = parseInt(paramId, 10);

    if (isNaN(todoId)) {
      res.status(400).json({ error: "Invalid ID format" });
      return;
    }

    const result = await todoService.deleteTodo(todoId, userId);

    if (!result) {
      res.status(404).json({ message: "Todo not found" });
      return;
    }

    res.status(204).send();
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Forbidden")) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }
    next(error);
  }
};

/**
 * GET /todos
 */
export const getTodos = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user!.id;

    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    const result = await todoService.getUserTodos(userId, { page, limit });

    res.status(200).json({
      data: result.data.map((todo) => ({
        id: todo.id,
        title: todo.title,
        description: todo.description,
      })),
      page: result.page,
      limit: result.limit,
      total: result.total,
    });
  } catch (error) {
    next(error);
  }
};
