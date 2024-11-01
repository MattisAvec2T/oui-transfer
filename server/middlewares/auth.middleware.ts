import CustomError from "errors/custom.error";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ExtendedRequest } from "types/extendedRequest";

export const verifyToken = (
    req: ExtendedRequest,
    res: Response,
    next: NextFunction
) => {
    const token = req.cookies?.token;

    if (!token) {
        throw new CustomError({ code: 401, message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        //@ts-ignore
        req.userMail = decoded.mail;
        next();
    } catch (error) {
        throw new CustomError({ code: 498, message: "Invalid token" });
    }
};
