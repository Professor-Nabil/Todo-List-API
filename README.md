# 📝 Professional Todo List API

A secure, layered, and paginated RESTful Todo List API built
using **Node.js**, **TypeScript**, and **Prisma** with a **MariaDB** database.
Tested in isolation using parallel test runners.

---

## 🛠️ Tech Stack & Key Features

- **TypeScript** for end-to-end type safety.
- **MariaDB + Prisma ORM** for structured schema design and high-performance querying.
- **JWT Authentication** for strict access control and resource isolation.
- **Zod** for schema validation before hitting endpoints.
- **Vitest + Supertest** for fast, isolated parallel integration testing.
- **Express-Rate-Limit** for preventing brute-force attacks.

---

## 🚀 Setup & Installation

### 1. Prerequisites

- **Node.js** (v18 or higher recommended)
- **MariaDB** (Running locally on default port `3306`)

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL="mysql://root:password@localhost:3306/todo_db"
JWT_SECRET="your-super-secret-key"
```

Create a `.env.test` file for test automation:

```env
PORT=3001
NODE_ENV=test
DATABASE_URL="mysql://root:password@localhost:3306/todo_test_db"
JWT_SECRET="test-secret-key"
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Push Database Schema

```bash
npx prisma db push
```

---

## 🚦 Test Suite

Our tests run on isolated worker databases to guarantee absolute test isolation.

```bash
# Run all tests once
npm run test

# Run a specific test file
npx vitest tests/userService.test.ts
```

---

## 🛰️ API Documentation & Sample Payloads

### 🔑 Authentication Endpoints

#### 1. **Register a New Account**

- **Endpoint:** `POST /register`
- **Request:**

```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nabil",
    "email": "nabil@example.com",
    "password": "secure-password-123"
  }'
```

- **Response `201 Created`:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 2. **Login & Generate Session Token**

- **Endpoint:** `POST /login`
- **Request:**

```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nabil@example.com",
    "password": "secure-password-123"
  }'
```

- **Response `200 OK`:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 📝 Todo Management Endpoints

> [!NOTE]
> Replace `$TOKEN` in the following examples with the JWT string returned by the register or login endpoint.

#### 3. **Create a New Task**

- **Endpoint:** `POST /todos`
- **Request:**

```bash
curl -X POST http://localhost:3000/todos \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Build backend endpoints",
    "description": "Complete phase 4 security and polish"
  }'
```

- **Response `201 Created`:**

```json
{
  "id": 1,
  "title": "Build backend endpoints",
  "description": "Complete phase 4 security and polish"
}
```

#### 4. **Retrieve Paginated Tasks**

- **Endpoint:** `GET /todos`
- **Request:**

```bash
curl -X GET "http://localhost:3000/todos?page=1&limit=2" \
  -H "Authorization: Bearer $TOKEN"
```

- **Response `200 OK`:**

```json
{
  "data": [
    {
      "id": 1,
      "title": "Build backend endpoints",
      "description": "Complete phase 4 security and polish"
    }
  ],
  "page": 1,
  "limit": 2,
  "total": 1
}
```

#### 5. **Update an Existing Task**

- **Endpoint:** `PUT /todos/:id`
- **Request:**

```bash
curl -X PUT http://localhost:3000/todos/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Build backend endpoints",
    "description": "Now fully complete with 100% test coverage"
  }'
```

- **Response `200 OK`:**

```json
{
  "id": 1,
  "title": "Build backend endpoints",
  "description": "Now fully complete with 100% test coverage"
}
```

#### 6. **Delete a Task**

- **Endpoint:** `DELETE /todos/:id`
- **Request:**

```bash
curl -X DELETE http://localhost:3000/todos/1 \
  -H "Authorization: Bearer $TOKEN"
```

- **Response `204 No Content`:** _(Empty body on success)_

---

[Readmap.sh](https://roadmap.sh/projects/todo-list-api)
