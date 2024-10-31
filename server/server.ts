import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import mysql from 'mysql2/promise'
import { verifyToken } from './middlewares/auth.middleware'
import { getRepository } from "./repository/repository";
import { App } from "./types/app";
import getAuthRoutes from './routes/auth.route';
import getPrivateRoutes from './routes/private.routes';

const server = express();
const port = 3000;

server.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
server.use(express.json())
server.use(cookieParser());

const database = mysql.createPool({
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

const repository = getRepository(database)
const app: App = {
    repository
}

server.use(getAuthRoutes(app))
server.use(verifyToken, getPrivateRoutes(app))

server.listen(port, () => console.log(`App running on port ${port}`));
