import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import appConfig from './config/app'
import { verifyToken } from './middlewares/auth.middleware'
import getAuthRoutes from './routes/auth.route';
import getPrivateRoutes from './routes/private.routes';
import getOtherRoutes from './routes/other.routes'
import errorMiddleware from './middlewares/error.middleware'
import { App } from 'types/app';

const server = express();
const port = 3000;

server.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
server.use(cookieParser());
server.use(express.json())

const app = appConfig;

server.use(getAuthRoutes(app))
server.use(verifyToken, getPrivateRoutes(app))
server.use(getOtherRoutes(app));

server.use(errorMiddleware)

server.listen(port, () => console.log(`App running on port ${port}`));
function getPublicRoutes(app: App): any {
    throw new Error('Function not implemented.');
}

