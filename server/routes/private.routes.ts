import { Router } from "express";
import { uploadController, getFilesController, deleteFileController, generateDownloadLinkController, updateController } from "../controllers/files.controller"
import { uploadFile } from "../middlewares/fileProvider.middleware"
import { App } from "types/app";

export default function getPrivateRoutes(app: App) {
    const privateRoutes = Router();
    privateRoutes.post("/upload", uploadFile.single('file'), uploadController(app));
    privateRoutes.get("/uploaded-files", getFilesController(app));
    privateRoutes.post("/generate-link", generateDownloadLinkController(app));
    privateRoutes.delete("/delete/:filePath", deleteFileController(app));
    privateRoutes.patch("/update", updateController(app));

    return privateRoutes;
}