import { describe, it, expect } from "vitest";
import bcrypt from "bcrypt";
import {
  createUser,
  getUserByEmail,
  getUserById,
} from "../src/services/userService.js";
import { prisma } from "../src/utils/prisma.js";

describe("User Service (Database Integration)", () => {
  it("should securely hash user passwords and save user", async () => {
    const rawPassword = "SecurePassword123!";

    const user = await createUser({
      name: "John Doe",
      email: "John@Doe.Com", // Mixed case to test normalisation
      password: rawPassword,
    });

    expect(user).toHaveProperty("id");
    expect(user.name).toBe("John Doe");
    expect(user.email).toBe("john@doe.com"); // Normalized lowercase

    // Check that we didn't return the raw password or its hash in the response
    expect(user).not.toHaveProperty("passwordHash");
    expect(user).not.toHaveProperty("password");

    // Pull from database directly to verify the password is securely hashed
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    expect(dbUser).not.toBeNull();

    const isPasswordValid = await bcrypt.compare(
      rawPassword,
      dbUser!.passwordHash,
    );
    expect(isPasswordValid).toBe(true);
  });

  it("should correctly find a user by their unique email address", async () => {
    await createUser({
      name: "Alice Smith",
      email: "alice@example.com",
      password: "password123",
    });

    const foundUser = await getUserByEmail("ALICE@EXAMPLE.COM"); // Case insensitive check
    expect(foundUser).not.toBeNull();
    expect(foundUser?.name).toBe("Alice Smith");
  });

  it("should fail to create a user with a duplicate email", async () => {
    await createUser({
      name: "Existing User",
      email: "duplicate@example.com",
      password: "password123",
    });

    // Attempting to create a second user with the same email should reject
    await expect(
      createUser({
        name: "New User",
        email: "DUPLICATE@example.com",
        password: "password456",
      }),
    ).rejects.toThrow();
  });

  it("should retrieve a user by their unique ID", async () => {
    const created = await createUser({
      name: "Bob Jones",
      email: "bob@example.com",
      password: "password123",
    });

    const user = await getUserById(created.id);
    expect(user).not.toBeNull();
    expect(user?.name).toBe("Bob Jones");
    expect(user).not.toHaveProperty("passwordHash");
  });
});
