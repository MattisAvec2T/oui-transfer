import { Repository } from "../types/repository";
import { userRepository } from "./user.repository";
import { Pool } from "mysql2/promise";

export function getRepository(database: Pool): Repository {
    return {
        UserRepository: userRepository(database)
    }
}