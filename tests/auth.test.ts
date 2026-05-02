import { describe, it, expect } from "vitest";
import request from "supertest";
import express from "express";
import authRoutes from "../src/routes/authRoutes.js";
import { errorHandler } from "../src/middleware/errorHandler.js";

// Scaffolding our Express instance specifically for tests
const app = express();
app.use(express.json());
app.use(authRoutes);
app.use(errorHandler);

describe("Authentication Layer (Integration Tests)", () => {
  it("should successfully register a new user and issue a valid JWT", async () => {
    const response = await request(app).post("/register").send({
      name: "Test User",
      email: "supertest@example.com",
      password: "secure-password-123",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("token");
    expect(typeof response.body.token).toBe("string");
  });

  it("should reject registering with a duplicate email address", async () => {
    // 1. Create original user
    await request(app).post("/register").send({
      name: "Original User",
      email: "duplicate@example.com",
      password: "password123",
    });

    // 2. Attempting to create user with duplicate email should be blocked
    const response = await request(app).post("/register").send({
      name: "Another User",
      email: "DUPLICATE@example.com",
      password: "password456",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Email already registered");
  });

  it("should reject registration payloads that fail validation rules", async () => {
    const response = await request(app).post("/register").send({
      name: "A", // too short (fails Zod min 2 constraint)
      email: "not-an-email", // invalid format
      password: "123", // too short
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Validation Failed");
    expect(response.body.details).toHaveLength(3);
  });

  it("should successfully authenticate a user and return a JWT", async () => {
    // 1. Setup user
    await request(app).post("/register").send({
      name: "Login User",
      email: "login@example.com",
      password: "password123",
    });

    // 2. Test valid login
    const response = await request(app).post("/login").send({
      email: "login@example.com",
      password: "password123",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(typeof response.body.token).toBe("string");
  });

  it("should block login attempts with incorrect credentials", async () => {
    // 1. Setup user
    await request(app).post("/register").send({
      name: "Safe User",
      email: "safe@example.com",
      password: "password123",
    });

    // 2. Attempt login with the wrong password
    const response = await request(app).post("/login").send({
      email: "safe@example.com",
      password: "wrong-password",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Invalid email or password");
  });
});
