import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import pool from 'db'
import multer from 'multer'
import path from 'path'
import authRoutes from './routes/auth.route'

const server = express()
const port = 3000

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
      const randomName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
      cb(null, randomName);
    }
  });

const upload_file = multer({storage: storage})

server.post('/upload', upload_file.single('file') , (req, res) => {
    try {
        const storedFileName = req.file?.filename
        const originalName = req.file?.originalname
        //store db à faire
        res.status(200).json({
            message: 'Fichier téléchargé',
            alias: storedFileName,
            originalName: originalName
        })
    } catch (error) {
        res.status(500).json({error: "erreur lors du téléchargement du fichier"})

    }

})

server.listen(port, () => console.log(`App running on port ${port}`))