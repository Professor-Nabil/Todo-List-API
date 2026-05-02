# Database Schema | To-Do List API

We use **Prisma ORM** targeting **MariaDB**.
It models both the user identities (for authentication)
and their distinct to-do list items (for authorized CRUD operations).

---

## 🛠️ Prisma Schema

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id           String   @id @default(uuid())
  name         String
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())

  // Relationships
  todos        Todo[]

  @@map("users")
}

model Todo {
  id          Int      @id @default(autoincrement())
  title       String
  description String   @db.Text
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relationships & Foreign Keys
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("todos")
}
```

---

## 🏷️ Data Models Breakdown

### 1. `User` Model

| Field Name     | Prisma Type | Constraints/Defaults      | Purpose                                          |
| :------------- | :---------- | :------------------------ | :----------------------------------------------- |
| `id`           | `String`    | `@id`, `@default(uuid())` | Primary key identifier (UUIDv4)                  |
| `name`         | `String`    | Required                  | User's full name                                 |
| `email`        | `String`    | `@unique`                 | Unique login email address                       |
| `passwordHash` | `String`    | Required                  | Scrambled bcrypt string (never store plain-text) |
| `createdAt`    | `DateTime`  | `@default(now())`         | User account registration timestamp              |

### 2. `Todo` Model

| Field Name    | Prisma Type | Constraints/Defaults               | Purpose                                  |
| :------------ | :---------- | :--------------------------------- | :--------------------------------------- |
| `id`          | `Int`       | `@id`, `@default(autoincrement())` | Primary key identifier                   |
| `title`       | `String`    | Required                           | Headline of the task                     |
| `description` | `String`    | Required, `@db.Text`               | Detailed context about the task          |
| `userId`      | `String`    | Required                           | Foreign key pointing to the creator's ID |
| `createdAt`   | `DateTime`  | `@default(now())`                  | Creation timestamp                       |
| `updatedAt`   | `DateTime`  | `@updatedAt`                       | Last modification timestamp              |

```

```
