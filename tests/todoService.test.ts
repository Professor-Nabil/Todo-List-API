import { describe, it, expect } from "vitest";
import { createUser } from "../src/services/userService.js";
import {
  createTodo,
  getTodoById,
  updateTodo,
  deleteTodo,
  getUserTodos,
} from "../src/services/todoService.js";
import { prisma } from "../src/utils/prisma.js";

describe("Todo Service (Database Integration)", () => {
  it("should successfully create a to-do task for a specific user", async () => {
    const user = await createUser({
      name: "Owner User",
      email: "owner@example.com",
      password: "password123",
    });

    const todo = await createTodo(user.id, {
      title: "Write integration tests",
      description: "Make sure Vitest passes with flying colors.",
    });

    expect(todo).toHaveProperty("id");
    expect(todo.userId).toBe(user.id);
    expect(todo.title).toBe("Write integration tests");
  });

  it("should retrieve a specific to-do task by its ID", async () => {
    const user = await createUser({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    const created = await createTodo(user.id, {
      title: "Fetch me",
      description: "Get this item from DB",
    });

    const found = await getTodoById(created.id);
    expect(found).not.toBeNull();
    expect(found?.id).toBe(created.id);
    expect(found?.title).toBe("Fetch me");
  });

  it("should update a to-do task only if the requester is the owner", async () => {
    const owner = await createUser({
      name: "Owner User",
      email: "owner@example.com",
      password: "password123",
    });

    const stranger = await createUser({
      name: "Stranger User",
      email: "stranger@example.com",
      password: "password123",
    });

    const todo = await createTodo(owner.id, {
      title: "Original Title",
      description: "Original Description",
    });

    // 1. Trying to update someone else's todo should fail
    await expect(
      updateTodo(todo.id, stranger.id, { title: "Hacked Title" }),
    ).rejects.toThrow("Forbidden: You do not own this to-do task");

    // 2. Updating your own todo should work completely
    const updated = await updateTodo(todo.id, owner.id, {
      title: "Updated Title",
    });

    expect(updated).not.toBeNull();
    expect(updated?.title).toBe("Updated Title");
    expect(updated?.description).toBe("Original Description"); // Keeps existing description
  });

  it("should delete a to-do task only if the requester is the owner", async () => {
    const owner = await createUser({
      name: "Owner User",
      email: "owner@example.com",
      password: "password123",
    });

    const stranger = await createUser({
      name: "Stranger User",
      email: "stranger@example.com",
      password: "password123",
    });

    const todo = await createTodo(owner.id, {
      title: "To Be Deleted",
      description: "Will disappear soon",
    });

    // 1. A stranger attempting to delete should be blocked
    await expect(deleteTodo(todo.id, stranger.id)).rejects.toThrow(
      "Forbidden: You do not own this to-do task",
    );

    // 2. The owner deleting should work perfectly
    await deleteTodo(todo.id, owner.id);

    const inDb = await prisma.todo.findUnique({ where: { id: todo.id } });
    expect(inDb).toBeNull();
  });

  it("should paginate user specific tasks and calculate total counts correctly", async () => {
    const user = await createUser({
      name: "Owner User",
      email: "owner@example.com",
      password: "password123",
    });

    // Seed 12 tasks for the user
    for (let i = 1; i <= 12; i++) {
      await createTodo(user.id, {
        title: `Task #${i}`,
        description: `Description for task #${i}`,
      });
    }

    // 1. Fetch Page 1 (Limit 5)
    const page1 = await getUserTodos(user.id, { page: 1, limit: 5 });
    expect(page1.data).toHaveLength(5);
    expect(page1.total).toBe(12);
    expect(page1.page).toBe(1);
    expect(page1.limit).toBe(5);

    // 2. Fetch Page 3 (Limit 5) -> Should only contain the remaining 2 items
    const page3 = await getUserTodos(user.id, { page: 3, limit: 5 });
    expect(page3.data).toHaveLength(2);
    expect(page3.total).toBe(12);
  });
});
