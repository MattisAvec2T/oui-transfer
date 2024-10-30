import express from 'express'
import pool from 'db'

const server = express()
const port = 3000

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

server.listen(port, () => console.log(`App running on port ${port}`))