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

export function getFilesController(app: App) {
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

export function generateDownloadLinkController(app: App) {
  return async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    try {
      const files: FileInterface[] = req.body.files.map((file: { filePath: string }) => ({
        filePath: file.filePath,
      }));

      const user: UserInterface = {
        mail: req.userMail,
      };

      const uniqueKey = await app.repository.FileRepository.generateDownloadLink(files, user);
      
      res.status(200).json({
        message: "Fichier téléchargé",
        data: uniqueKey
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
        filePath: req.params.filePath,
      };

      const user: UserInterface = {
        mail: req.userMail,
      };
      await app.repository.FileRepository.deleteFile(file, user);
      try {
        const __filepath = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filepath);
        const filePath = path.join(__dirname, "../uploads", file.filePath);
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Erreur lors de la suppression du fichier dans le file system :", err);
          }
        })
      } catch (error) {
        console.error("Erreur lors de la suppression du fichier dans le file system :", error);
      }
      res.status(200).json({
        message: "Fichier supprimé",
      });
    } catch (error) {
      next(error)
    }
  };
}

export function updateController(app: App) {
  return async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    try {
      
      const file: FileInterface = {
        fileName: req.body.fileName,
        filePath: req.body.filePath,
      };

      const user: UserInterface = {
        mail: req.userMail,
      };

      console.log(file, user);
      
      await app.repository.FileRepository.updateFile(file, user);
      
      res.status(200).json({
        message: "Fichier mis à jour",
        file : file
      });
    } catch (error) {
      next(error)
    }
  }
}

export function downloadController(app: App) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const uniqueKey = req.params.uniqueKey;
      
      const files: FileInterface[] = await app.repository.FileRepository.getDownloadLinkFiles(uniqueKey);
      
      const __filepath = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filepath);
      const uploadsDir = path.join(__dirname, "../uploads");

      const zip = new JSZip();

      for (const file of files) {
        const filePath = path.join(uploadsDir, file.filePath);
        
        if (fs.existsSync(filePath)) {
          const fileData = fs.readFileSync(filePath);
          zip.file(file.fileName!, fileData); 
        } else {
          console.warn(`Fichier introuvable : ${filePath}`);
        }
      }

      const zipData = await zip.generateAsync({ type: "nodebuffer" });

      res.set({
        "Content-Disposition": `attachment; filename=oui-transfer.zip`,
        "Content-Type": "application/zip",
      }).send(zipData);

    } catch (error) {
      next(error);
    }
  };
}