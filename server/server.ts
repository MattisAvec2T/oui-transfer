import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import multer from 'multer';
import path from 'path';
import authRoutes from './routes/auth.route'
import fs from 'fs';
import JSZip from 'jszip';
import pool from 'db';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = express();
const port = 3000;

server.use(cors());
server.use(express.json())
server.use(cookieParser());

server.use(authRoutes)

server.get("/", (req, res, next) => {
    res.json({
        message: "Test"
    })
})

server.get('/test-db', async (req, res) => {
    try {
        const rows = await pool.query('SELECT * from users');
        res.json({ message: 'Connexion à la base de données réussie!', rows });
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({ error: 'Erreur de connexion à la base de données', details: error.message });
    }
    
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    const randomName = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, randomName);
  },
});

const upload_file = multer({ storage: storage });
const uploadedFilesMap = new Map();

server.post('/upload', upload_file.single('file'), (req, res) => {
  try {
    const storedFileName = req.file?.filename;
    const originalName = req.file?.originalname;

    uploadedFilesMap.set(storedFileName, originalName);

    res.status(200).json({
      message: 'Fichier téléchargé',
      alias: storedFileName,
      originalName: originalName,
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors du téléchargement du fichier' });
  }
});

server.get('/download-zip/:filename', async (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, 'uploads', filename);

    if (fs.existsSync(filePath)) {
        try {
            const zip = new JSZip();
            const fileData = fs.readFileSync(filePath);
            
            const originalName = uploadedFilesMap.get(filename);

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
});

  

server.listen(port, () => console.log(`App running on port ${port}`));
