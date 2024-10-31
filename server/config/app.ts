import mysql from 'mysql2/promise'
import { getRepository } from "../repository/repository";
import { App } from "../types/app";

const database = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 3306,
})

const repository = getRepository(database)
const appConfig: App = {
    repository
}

export default appConfig;