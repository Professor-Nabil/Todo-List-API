import bcrypt from "bcrypt";
import { prisma } from "../utils/prisma.js";

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

/**
 * 1. Create a new user account with hashed credentials
 */
export const createUser = async (data: CreateUserInput) => {
  // Hash the plain-text password using a salt factor of 10
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(data.password, saltRounds);

  return await prisma.user.create({
    data: {
      name: data.name,
      email: data.email.toLowerCase().trim(),
      passwordHash,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      // Exclude passwordHash in the returned payload for security
    },
  });
};

/**
 * 2. Retrieve user by unique email address
 */
export const getUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  });
};

/**
 * 3. Retrieve user by unique ID
 */
export const getUserById = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });
};
