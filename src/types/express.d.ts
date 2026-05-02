import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

/* NOTE:
 * Make sure to include it in your tsconfig.json so it is picked up:
 */
// "include": ["src/**/*", "src/types/express.d.ts"]
