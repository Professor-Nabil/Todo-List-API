# Tech Stack & Dependencies | To-Do List API

## ⚙️ Core Runtime & Framework

- **Runtime Environment**: `Node.js` (v20+ LTS)
- **Programming Language**: `TypeScript` (v5+)
- **Web Framework**: `Express` (v5.x) - Using high-performance native async error handling.

## 🗄️ Database & ORM

- **Database Driver**: `MariaDB` (via Prisma's `mysql` provider)
- **ORM**: `Prisma v6.x` & `@prisma/client v6.x` - For type-safe data access.

## 🔌 Security, Middleware & Core Tools

- **Authentication**: `jsonwebtoken` (with `@types/jsonwebtoken`) - To issue and verify stateless authentication tokens.
- **Password Hashing**: `bcrypt` (with `@types/bcrypt`) - For securely salting and hashing credentials before database insertion.
- **Data Validation**: `zod` - For rigorous parsing and validation of incoming request query params and body payloads.
- **Environment Management**: `dotenv` - For runtime database secrets and token signing keys.
- **Development Runner**: `tsx` - For hot-reloading native ESM TypeScript.

## 🧪 Testing Suite

- **Runner**: `vitest`
- **HTTP Client**: `supertest`

---

## 💡 Suggestions Before We Start Phase 1

1. **Prisma Client Extensibility (Express `Request` Context)**:
   Since the user ID will be extracted from the JWT token and attached to the request,
   we will extend the Express `Request` type interface
   via TypeScript's Declaration Merging to prevent type errors.

2. **Database Field for To-Dos**:
   Since the given example output contains `id: 1` or `id: 2`,
   we will use an auto-incrementing `Int` identifier for the `Todo` model,
   but keep the `User` IDs as `String` UUIDs for maximum security.
