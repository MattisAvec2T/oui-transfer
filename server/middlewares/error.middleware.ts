import { Request, Response, NextFunction } from "express";
import CustomError from "../errors/custom.error";

const errorMiddleware = (err: CustomError | Error, req: Request, res: Response, next: NextFunction) => {
    const errorStatusCode = (err instanceof CustomError) ? err.code : 500;
    const errorMessage = err.message;

    res.status(errorStatusCode).json({
        success: false,
        error: errorMessage,
    });
};

export default errorMiddleware;