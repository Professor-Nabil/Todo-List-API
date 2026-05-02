# TODO: To-Do List API with Authentication (Layered Build Strategy)

## 📋 Project Overview & Feature Goals

Build a RESTful CRUD To-Do List API featuring user registration, JWT-based login,
strict data ownership authorization, paginated lists, and security measures.

---

## 🛠️ Implementation Phases

### 📦 Phase 1: Database Setup & Schema Creation

Set up the multi-table relational schema with explicit ownership constraints.

- [x] **Commit 1: Setup Prisma, Database Schema, and Initial Migration**
  - Configure the database connection in `.env`.
  - Create the `User` model (`id`, `name`, `email`, `passwordHash`, `createdAt`).
  - Create the `Todo` model (`id`, `title`, `description`, `userId`, `createdAt`, `updatedAt`).
  - Set up a **One-to-Many relationship** (One User has Many Todos).
  - Run the first migration (`npx prisma migrate dev --name init`) to generate MariaDB tables.

---

### ⚙️ Phase 2: Core Services Layer (Database Operations)

Write and isolate all business queries for both Users and Todos using Prisma.

- [x] **Commit 2: Create User & Authentication Services**
  - Create `src/services/userService.ts`:
    - `createUser(data)`: Hashes passwords with `bcrypt` and stores the user.
    - `getUserByEmail(email)`: Retrieves a user by their unique email.
    - `getUserById(id)`: Fetches user details.
  - Create Vitest tests to guarantee password hashing and unique email storage work.

- [x] **Commit 3: Create Todo CRUD & Pagination Services**
  - Create `src/services/todoService.ts`:
    - `createTodo(userId, data)`: Creates a todo tied to the specific user.
    - `getTodoById(id)`: Retrieves a specific todo.
    - `updateTodo(id, userId, data)`: Overwrites a todo _only if_ the user is the owner.
    - `deleteTodo(id, userId)`: Removes a todo _only if_ the user is the owner.
    - `getUserTodos(userId, paginationOptions)`: Fetches user-specific todos with dynamic `skip` and `take` math.
  - Create Vitest tests to confirm strict user data isolation.

---

### 🌐 Phase 3: Controller & Middleware Layer

Add parsing, endpoint logic, JWT validation, and input verification.

- [x] **Commit 4: Auth Controllers & JWT Validation Middleware**
  - Implement Zod validation schemas for registration and login requests.
  - Write authentication controllers (`POST /register`, `POST /login`) that sign JWTs.
  - Create the authentication middleware to intercept HTTP requests, decode the `Bearer` token, and attach the user ID to `req.user`.

- [ ] **Commit 5: Todo HTTP Request Handlers**
  - Write validation schemas for creating and updating todo items.
  - Build route handlers for `POST /todos`, `PUT /todos/:id`, `DELETE /todos/:id`, and `GET /todos`.
  - Implement strict route-level authorization (returning `403 Forbidden` if a user attempts to update or delete a todo belonging to another user).
  - Inject pagination math into the `GET /todos` controller to dynamically handle `page`, `limit`, and metadata (`total`).

---

### 🧹 Phase 4: Security & Polish

Lock down the application and document the architecture.

- [ ] **Commit 6: Rate Limiting & Global Error Middleware**
  - Introduce global request rate-limiting middleware to prevent brute-force attacks.
  - Build global error-handling middleware to catch JWT and validation exceptions.
  - Finalize the `README.md` with setup guides, test execution commands, and sample payloads.
