import { Router } from "express";
import { uploadController, downloadController, uploadedFilesController, deleteFileController } from "../controllers/files.controller"
import { uploadFile } from "../middlewares/fileProvider.middleware"
import { App } from "types/app";

export default function getPrivateRoutes(app: App) {
    const privateRoutes = Router();
    privateRoutes.post("/upload", uploadFile.single('file'), uploadController(app));
    privateRoutes.get("/uploaded-files", uploadedFilesController(app));
    privateRoutes.delete("/delete/:filename", deleteFileController(app));
    privateRoutes.get("/download-zip/:filename", downloadController(app));

    return privateRoutes;
}