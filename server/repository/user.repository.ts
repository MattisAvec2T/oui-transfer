import {Pool} from "mysql2/promise";
import {UserInterface, UserRepositoryInterface} from "../types/user";
import DatabaseError from "../errors/database.error";

export function userRepository(database: Pool): UserRepositoryInterface {
    return {
        getOne: async (id: number) => {
            const [results] = await database.execute("SELECT id, username, mail, password, quota, used_space FROM users WHERE id = ?", [id]);
            //@ts-ignore
            return results[0]
        },
        insert: async (user: UserInterface): Promise<UserInterface | Error> => {
            try {
                await database.execute(
                    "INSERT INTO users (username, mail, password) VALUES (?, ?, ?)",
                    [user.username, user.mail, user.password]
                );
                return user;
            } catch (error: any) {
                if (error.code === 'ER_DUP_ENTRY') {
                    throw new DatabaseError({ code: 401, message: "The email ${user.mail} is already used."});
                } else {
                    throw (error instanceof DatabaseError) ?  error : new Error('An error occurred while creating account. Please try again later.');
                }
            }
        },
        getByMailPassword: async (user: UserInterface): Promise<UserInterface | void> => {
            try {
                const [results] = await database.execute(
                    "SELECT username, mail FROM users WHERE mail = ? AND password = ?",
                    [user.mail, user.password]
                );
                //@ts-ignore
                if (results.length > 0) {
                    return user;
                } else {
                    throw new DatabaseError({ code: 401, message: "Wrong credentials"});
                }
            } catch (error) {
                throw (error instanceof DatabaseError) ?  error : new Error('An error occurred while searching for user. Please try again later.');
            }
        }
    }
}
