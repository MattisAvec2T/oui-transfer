import { NextFunction, Request, Response } from "express";
import fs from "fs";
import JSZip from "jszip";
import path from "path";
import { App } from "types/app";
import { ExtendedRequest } from "types/extendedRequest";
import { FileInterface } from "types/file";
import { UserInterface } from "types/user";
import { fileURLToPath } from "url";

export function uploadController(app: App) {
  return async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    try {
      const file: FileInterface = {
        fileName: req.file!.originalname,
        filePath: req.file!.filename,
        fileSize: req.file!.size,
      };

      const user: UserInterface = {
        mail: req.userMail,
      };
      await app.repository.FileRepository.checkUploadLimit(file, user)
      await app.repository.FileRepository.saveFile(file, user);
      res.status(200).json({
        message: "Fichier téléchargé",
        alias: file.filePath,
        originalName: file.fileName,
      });
    } catch (error) {
      next(error)
    }
  };
}

export function uploadedFilesController(app: App) {
    return async (req: ExtendedRequest, res: Response, next: NextFunction) => {
      try {
        const user: UserInterface = {
          mail: req.userMail,
        };
        const files : FileInterface[] = await app.repository.FileRepository.getUserFiles(user)
        res.status(200).json({
          message: "Fichier téléchargé",
          data: files
        });
      } catch (error) {
        next(error)
      }
    };
  }

  export function deleteFileController(app: App) {
    return async (req: ExtendedRequest, res: Response, next: NextFunction) => {
      try {
        const file: FileInterface = {
            fileName: req.file!.originalname,
            filePath: req.file!.filename,
            fileSize: req.file!.size,
          };
          console.log('file', file);
          

        const user: UserInterface = {
          mail: req.userMail,
        };
        await app.repository.FileRepository.deleteFile(file, user)
        res.status(200).json({
          message: "Fichier supprimé",
        });
      } catch (error) {
        next(error)
      }
    };
  }

export function downloadController(app: App) {
  return async (req: Request, res: Response) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const { filename } = req.params;
    const filePath = path.join(__dirname, "uploads", filename);

    if (fs.existsSync(filePath)) {
      try {
        const zip = new JSZip();
        const fileData = fs.readFileSync(filePath);

        // DB shenanigans + map bien fun
        // const originalName = uploadedFilesMap.get(filename);

        const originalName = "";
        zip.file(originalName, fileData);

        const zipData = await zip.generateAsync({ type: "nodebuffer" });

        res.set({
          "Content-Disposition": `attachment; filename=${filename}.zip`,
          "Content-Type": "application/zip",
        });
        res.send(zipData);
      } catch (error) {
        console.error("Erreur lors de la création du fichier ZIP:", error);
        res
          .status(500)
          .json({ error: "Erreur lors de la création du fichier ZIP" });
      }
    } else {
      console.log("Fichier introuvable:", filePath);
      res.status(404).json({ error: "Fichier introuvable" });
    }
  };
}
function next(error: unknown) {
    throw new Error("Function not implemented.");
}

