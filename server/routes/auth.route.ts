import { Router } from "express";
import { registerController, loginController, logoutController } from "../controllers/auth.controller";
import { checkSchema } from "express-validator";
import { userSchema } from "../schemas/user.schema"
import { App } from "types/app";

export default function getAuthRoutes(app: App) {
    
    const authRoutes = Router();
    authRoutes.post("/register", checkSchema(userSchema().withUsername()), registerController(app));
    authRoutes.post("/login", checkSchema(userSchema().schema), loginController(app));
    authRoutes.post("/logout", logoutController());

    return authRoutes;
}