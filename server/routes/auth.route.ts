import { Router, Request, Response } from "express";
import { registerController, loginController, logoutController } from "../controllers/auth.controller"

const authRoutes = Router();
authRoutes.post("/register", registerController);
authRoutes.post("/login", loginController);
authRoutes.post("/logout", logoutController);

export default authRoutes;