import {Pool} from "mysql2/promise";
import {UserInterface, UserRepositoryInterface} from "../types/user";

export function userRepository(database: Pool): UserRepositoryInterface {
    return {
        getAll: async () => {
            const [results] = await database.query("SELECT id, username, mail, password, quota, used_space FROM users");
            return results as UserInterface[]
        },
        delete: async (id: number) => {
            await database.execute("DELETE FROM users where id = ?", [id]);
        },
        getOne: async (id: number) => {
            const [results] = await database.execute("SELECT id, username, mail, password, quota, used_space FROM users WHERE id = ?", [id]);
            //@ts-ignore
            return results[0]
        },
        insert(user: UserInterface): Promise<UserInterface> {
            return Promise.resolve({id: 1, title: "test", completed: true});
        },
        update(user: UserInterface): Promise<UserInterface> {
            return Promise.resolve({id: 1, title: "test", completed: true});
        },
    }
}
