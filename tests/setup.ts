import { config } from "dotenv";
import { execSync } from "child_process";
import { afterAll, beforeEach } from "vitest";

// 1. Load the test variables
config({ path: ".env.test" });

// 2. Generate a unique database name for this worker
const workerId = process.env.VITEST_POOL_ID || "1";
const dbName = `todo_test_db_${workerId}`;
const url = `mysql://root:jjjj@localhost:3306/${dbName}`;

// 3. Force override the environment variables so both process.env and Prisma pick it up
process.env.DATABASE_URL = url;

// 4. Create database and synchronously push the schema to it
execSync(
  `mariadb -u root -pjjjj -e "CREATE DATABASE IF NOT EXISTS ${dbName};"`,
);
execSync("npx prisma db push --force-reset --accept-data-loss");

// Now it is safe to import Prisma, because DATABASE_URL is guaranteed to be in place
const { prisma } = await import("../src/utils/prisma.js");

// Clear the database tables before each individual test runs
beforeEach(async () => {
  await prisma.$transaction([
    prisma.todo.deleteMany({}),
    prisma.user.deleteMany({}),
  ]);
});

// Drop the isolated database once all the tests in this worker finish
afterAll(() => {
  console.log(`🧹 Cleaning up database: ${dbName}`);
  execSync(`mariadb -u root -pjjjj -e "DROP DATABASE IF EXISTS ${dbName};"`, {
    stdio: "ignore",
  });
});
