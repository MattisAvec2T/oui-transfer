import CustomError from "errors/custom.error";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verifyToken = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.cookies?.token;
    console.debug(req);

    if (!token) {
        throw new CustomError({ code: 401, message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        //@ts-ignore
        req.body.mail = decoded.mail;
        next();
    } catch (error) {
        throw new CustomError({ code: 401, message: "Invalid token" });
    }
};
