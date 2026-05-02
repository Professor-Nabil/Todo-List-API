import { config } from "dotenv";
import { execSync } from "child_process";
import { afterAll, beforeEach } from "vitest";
import { prisma } from "../src/utils/prisma.js";

// 1. Load the test variables
config({ path: ".env.test" });

// 2. Generate a unique database name for this worker
const workerId = process.env.VITEST_POOL_ID || "1";
const dbName = `todo_test_db_${workerId}`;
const url = `mysql://root:jjjj@localhost:3306/${dbName}`;

// 3. Inject this URL into the environment so Prisma picks it up
process.env.DATABASE_URL = url;

// 4. Create the database if it doesn't exist and push schema
execSync(
  `mariadb -u root -pjjjj -e "CREATE DATABASE IF NOT EXISTS ${dbName};"`,
  { stdio: "ignore" },
);
execSync("npx prisma db push --force-reset", { stdio: "ignore" });

// Clear the database tables before each test runs
beforeEach(async () => {
  await prisma.$transaction([
    prisma.todo.deleteMany({}),
    prisma.user.deleteMany({}),
  ]);
});

// Drop the isolated database once all the tests in this worker run finish
afterAll(() => {
  console.log(`🧹 Cleaning up database: ${dbName}`);
  execSync(`mariadb -u root -pjjjj -e "DROP DATABASE IF EXISTS ${dbName};"`, {
    stdio: "ignore",
  });
});
