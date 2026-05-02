import { prisma } from "../utils/prisma.js";

export interface CreateTodoInput {
  title: string;
  description: string;
}

export interface UpdateTodoInput {
  title?: string;
  description?: string;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

/**
 * 1. Create a new to-do task linked to the authenticating user
 */
export const createTodo = async (userId: string, data: CreateTodoInput) => {
  return await prisma.todo.create({
    data: {
      title: data.title,
      description: data.description,
      userId,
    },
  });
};

/**
 * 2. Retrieve a single to-do task by its ID
 */
export const getTodoById = async (id: number) => {
  return await prisma.todo.findUnique({
    where: { id },
  });
};

/**
 * 3. Update a to-do task only if the user is the owner
 */
export const updateTodo = async (
  id: number,
  userId: string,
  data: UpdateTodoInput,
) => {
  // Check ownership first
  const todo = await prisma.todo.findUnique({ where: { id } });
  if (!todo) return null;
  if (todo.userId !== userId) {
    throw new Error("Forbidden: You do not own this to-do task");
  }

  return await prisma.todo.update({
    where: { id },
    data: {
      title: data.title ?? undefined,
      description: data.description ?? undefined,
    },
  });
};

/**
 * 4. Delete a to-do task only if the user is the owner
 */
export const deleteTodo = async (id: number, userId: string) => {
  // Check ownership first
  const todo = await prisma.todo.findUnique({ where: { id } });
  if (!todo) return null;
  if (todo.userId !== userId) {
    throw new Error("Forbidden: You do not own this to-do task");
  }

  return await prisma.todo.delete({
    where: { id },
  });
};

/**
 * 5. Retrieve paginated list of to-do tasks for a specific user
 */
export const getUserTodos = async (
  userId: string,
  options: PaginationOptions,
) => {
  const page = Math.max(1, options.page || 1);
  const limit = Math.max(1, options.limit || 10);
  const skip = (page - 1) * limit;

  // Run both queries concurrently for efficiency
  const [todos, total] = await Promise.all([
    prisma.todo.findMany({
      where: { userId },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.todo.count({
      where: { userId },
    }),
  ]);

  return {
    data: todos,
    page,
    limit,
    total,
  };
};
