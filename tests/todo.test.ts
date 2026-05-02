import { describe, it, expect } from "vitest";
import request from "supertest";
import express from "express";
import todoRoutes from "../src/routes/todoRoutes.js";
import authRoutes from "../src/routes/authRoutes.js";
import { errorHandler } from "../src/middleware/errorHandler.js";

// Initialize a testing Express app instance
const app = express();
app.use(express.json());
app.use(authRoutes);
app.use("/todos", todoRoutes);
app.use(errorHandler);

const getAuthToken = async (email: string): Promise<string> => {
  const response = await request(app).post("/register").send({
    name: "Test User",
    email,
    password: "password123",
  });
  return response.body.token;
};

describe("Todo Layer (HTTP Integration Tests)", () => {
  it("should block requests to the todos endpoint if no token is provided", async () => {
    const response = await request(app).get("/todos");
    expect(response.status).toBe(401);
  });

  it("should allow a valid user to create a new task", async () => {
    const token = await getAuthToken("create@example.com");

    const response = await request(app)
      .post("/todos")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test task",
        description: "Task description",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.title).toBe("Test task");
  });

  it("should return a 400 bad request if validation fails", async () => {
    const token = await getAuthToken("badrequest@example.com");

    const response = await request(app)
      .post("/todos")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "", // Must not be empty
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Validation Failed");
  });

  it("should successfully retrieve paginated tasks for the current user", async () => {
    const token = await getAuthToken("paginate@example.com");

    // Seed 3 tasks
    for (let i = 1; i <= 3; i++) {
      await request(app)
        .post("/todos")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: `Task ${i}`,
          description: `Desc ${i}`,
        });
    }

    const response = await request(app)
      .get("/todos?page=1&limit=2")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(2);
    expect(response.body.total).toBe(3);
    expect(response.body.page).toBe(1);
    expect(response.body.limit).toBe(2);
  });

  it("should prevent a user from updating or deleting tasks owned by someone else", async () => {
    const token1 = await getAuthToken("user1@example.com");
    const token2 = await getAuthToken("user2@example.com");

    // 1. User 1 creates a task
    const todoRes = await request(app)
      .post("/todos")
      .set("Authorization", `Bearer ${token1}`)
      .send({
        title: "User 1 Task",
        description: "Private task",
      });

    const todoId = todoRes.body.id;

    // 2. User 2 attempts to update User 1's task
    const updateRes = await request(app)
      .put(`/todos/${todoId}`)
      .set("Authorization", `Bearer ${token2}`)
      .send({
        title: "Hacked Title",
      });

    expect(updateRes.status).toBe(403);

    // 3. User 2 attempts to delete User 1's task
    const deleteRes = await request(app)
      .delete(`/todos/${todoId}`)
      .set("Authorization", `Bearer ${token2}`);

    expect(deleteRes.status).toBe(403);
  });
});
