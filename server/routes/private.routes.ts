import { Router } from "express";
import { uploadController, downloadController } from "../controllers/files.controller"
import { uploadFile } from "../middlewares/fileProvider.middleware"
import { App } from "types/app";
import { verifyToken } from "middlewares/auth.middleware";

export default function getPrivateRoutes(app: App) {
    const privateRoutes = Router();
    privateRoutes.post("/upload", verifyToken, uploadFile.single('file'), uploadController(app));
    privateRoutes.get("/download-zip/:filename", downloadController(app));

    return privateRoutes;
}