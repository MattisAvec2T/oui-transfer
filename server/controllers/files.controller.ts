import { Request, Response } from "express";
import fs from 'fs';
import JSZip from 'jszip';
import path from 'path';
import { App } from "types/app";
import { fileURLToPath } from 'url';

export function uploadController(app: App) {
    return async (req: Request, res: Response) => {
        try {
            const storedFileName = req.file?.filename;
            const originalName = req.file?.originalname;
        
            // DB shenanigans
            // uploadedFilesMap.set(storedFileName, originalName);
        
            res.status(200).json({
                message: 'Fichier téléchargé',
                alias: storedFileName,
                originalName: originalName,
            });
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors du téléchargement du fichier' });
        }
    }
}

export function downloadController(app: App) {
    return async (req: Request, res: Response) => {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const { filename } = req.params;
        const filePath = path.join(__dirname, 'uploads', filename);

        if (fs.existsSync(filePath)) {
            try {
                const zip = new JSZip();
                const fileData = fs.readFileSync(filePath);
                
                // DB shenanigans + map bien fun
                // const originalName = uploadedFilesMap.get(filename);

                const originalName = ""
                zip.file(originalName, fileData);

                const zipData = await zip.generateAsync({ type: 'nodebuffer' });

                res.set({
                    'Content-Disposition': `attachment; filename=${filename}.zip`,
                    'Content-Type': 'application/zip',
                });
                res.send(zipData);
            } catch (error) {
                console.error('Erreur lors de la création du fichier ZIP:', error);
                res.status(500).json({ error: 'Erreur lors de la création du fichier ZIP' });
            }
        } else {
            console.log('Fichier introuvable:', filePath);
            res.status(404).json({ error: 'Fichier introuvable' });
        }
    }
}