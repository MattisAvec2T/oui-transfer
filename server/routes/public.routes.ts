import { Router } from "express";
import { downloadController } from "../controllers/files.controller"
import { App } from "types/app";

export default function getPublicRoutes(app: App) {
    const otherRoutes = Router();
    otherRoutes.get("/download/:uniqueKey", downloadController(app));

    return otherRoutes;
}