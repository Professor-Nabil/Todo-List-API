import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // Log the internal error for server monitoring
  if (process.env.NODE_ENV !== "test") {
    console.error(
      `Error processing request to ${req.method} ${req.originalUrl}:`,
      err,
    );
  }

  // Handle Invalid/Malformed JSON body payloads
  if (err instanceof SyntaxError && "status" in err && err.status === 400) {
    res.status(400).json({ error: "Invalid JSON payload" });
    return;
  }

  // Handle JsonWebToken validation errors
  if (err.name === "JsonWebTokenError") {
    res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
    return;
  }

  // Catch remaining unhandled exceptions
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
};
