import { Router } from "express";
import { uploadController, downloadController } from "../controllers/files.controller"
import { uploadFile } from "../middlewares/fileProvider.middleware"
import { App } from "types/app";

export default function getPrivateRoutes(app: App) {
    const privateRoutes = Router();
    privateRoutes.post("/upload", uploadFile.single('file'), uploadController(app));
    privateRoutes.get("/download-zip/:filename", downloadController(app));

    return privateRoutes;
}