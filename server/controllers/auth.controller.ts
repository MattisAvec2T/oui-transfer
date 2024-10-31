import { createHash } from "crypto";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import pool from "db";
dotenv.config();


export const registerController = async (req: Request, res: Response) => {
    try {
        const user = {
            "username" : req.body.username,
            "mail" : req.body.mail,
            "password" : req.body.password
        };
        const hashedPassword = createHash("sha3-256").update(req.body.password).digest("hex");
        // DB : INSERT INTO users
        pool.query(
            'INSERT INTO users (username, mail, password) VALUES (?, ?, ?)',
            [user.username, user.mail, hashedPassword]
        );
        //
        res.status(201).json({ success: true, user: user });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const loginController = async (req: Request, res: Response) => {
    try {
        const user = {
            "mail" : req.body.mail,
            "password" : req.body.password
        };
        const hashedPassword = createHash("sha3-256").update(req.body.password).digest("hex");
        // DB : SELECT FROM user WHERE mail = .. && password = ....
        pool.query(
            "SELECT username, mail FROM users WHERE mail = ? AND password = ?",
            [user.mail, hashedPassword]
        );
        // Si résultat : 
        const token = jwt.sign(
            { name:"user@mail" },// { user.mail },
            process.env.JWT_SECRET!,
            { expiresIn: process.env.JWT_EXPIRES }
        );
        res.status(201).cookie("token", token).json({ success: true, user: user });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const logoutController = async (_: Request, res: Response) => {
    res.clearCookie("token");
    res.status(205).json({ "success" : true });
}