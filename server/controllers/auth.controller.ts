import { createHash } from "crypto";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { validationResult } from "express-validator";
import { App } from "types/app";
dotenv.config();


export function registerController(app: App) {
    return async (req: Request, res: Response) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ message: "Request body missing elements", errors: errors.array() });
            }
            const user = req.body;
            const hashedPassword = createHash("sha3-256").update(req.body.password).digest("hex");
            const hashedUser = { ...user };
            hashedUser.password = hashedPassword;
            app.repository.UserRepository.insert(hashedUser);
            res.status(201).json({ success: true, user: user });
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    }
}

export function loginController(app: App) {
    return async (req: Request, res: Response) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ message: "Request body missing elements", errors: errors.array() });
            }
            const user = req.body;
            const hashedPassword = createHash("sha3-256").update(req.body.password).digest("hex");
            const hashedUser = { ...user };
            hashedUser.password = hashedPassword;
            // DB shenanigans
            // pool.query(
            //     "SELECT username, mail FROM users WHERE mail = ? AND password = ?",
            //     [user.mail, hashedPassword]
            // );
            // Si résultat : 
            const token = jwt.sign(
                { name:"user@mail" },// { user.mail },
                process.env.JWT_SECRET!,
                { expiresIn: process.env.JWT_EXPIRES }
            );
            console.log(token);
            
            res.status(201).cookie("token", token).json({ success: true, user: user });
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    }
}

export function logoutController() {
    return async (_: Request, res: Response) => {
        res.clearCookie("token");
        res.status(205).json({ "success" : true });
    }
}