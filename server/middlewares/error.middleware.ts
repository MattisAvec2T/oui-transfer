import { Request, Response, NextFunction } from "express";
import DatabaseError from "../errors/database.error";

const errorMiddleware = (err: DatabaseError | Error, req: Request, res: Response, next: NextFunction) => {
    const errorStatusCode = (err instanceof DatabaseError) ? err.code : 500;
    const errorMessage = err.message;
  
    res.status(errorStatusCode).json({
        success: false,
        error: errorMessage,
    });
};

export default errorMiddleware;