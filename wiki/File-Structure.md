# File Structure & Module Map | To-Do List API

```bash
.
├── .env                  # Local secrets (PORT, DATABASE_URL, JWT_SECRET)
├── .env.example          # Shared configuration template
├── package.json          # Project configuration & scripts
├── prisma
│   └── schema.prisma     # Relational database models
├── src
│   ├── app.ts            # Core Express server configuration
│   ├── controllers       # HTTP request handlers
│   │   ├── authController.ts
│   │   └── todoController.ts
│   ├── middleware        # Custom express middleware
│   │   ├── auth.ts       # JWT Validation & Extraction
│   │   ├── errorHandler.ts
│   │   └── validate.ts
│   ├── routes            # API Endpoint definitions
│   │   ├── authRoutes.ts
│   │   └── todoRoutes.ts
│   ├── server.ts         # Network listener startup
│   ├── services          # Business queries & data management
│   │   ├── todoService.ts
│   │   └── userService.ts
│   ├── types             # Express request type extensions
│   │   └── express.d.ts
│   └── utils             # Shared utility helpers
│       └── prisma.ts     # Singleton Prisma Client
├── tests                 # Integration tests (using Vitest & Supertest)
│   ├── auth.test.ts
│   ├── setup.ts
│   └── todo.test.ts
├── tsconfig.json         # TypeScript configuration
└── vitest.config.ts      # Vitest configuration
```
