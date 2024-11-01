import { Pool } from "mysql2/promise";
import { FileInterface, FileRepositoryInterface } from "../types/file";
import { UserInterface } from "types/user";
import CustomError from "errors/custom.error";

export function fileRepository(database: Pool): FileRepositoryInterface {
    return {
        saveFile: async (file: FileInterface, user: UserInterface): Promise<FileInterface | Error> => {
            try{                
                await database.execute(
                    "INSERT INTO files (user_id, file_name, file_path, file_size) VALUES ((SELECT id FROM users WHERE mail = ?), ?, ?, ?)",
                    [user.mail, file.fileName, file.filePath, file.fileSize]
                );
                return file
            } catch (error: any) {
                throw new Error('An error occurred while creating a file. Please try again later.');
            }
        },
        checkUploadLimit: async (file: FileInterface, user: UserInterface): Promise<FileInterface | Error> => {
            try {
                const [rows] = await database.execute(
                    `
                    SELECT (
                        COALESCE(SUM(file_size), 0) + ?
                    ) AS total_size
                    FROM files
                    WHERE (SELECT id FROM users WHERE mail = ?)
                    `,
                    [file.fileSize, user.mail]
                );
                //@ts-ignore
                if (rows[0].total_size < 2147483648) { //2Go
                    return file;
                } else {
                    throw new CustomError({ code: 413, message: "Upload limit exceeded. Maximum 2GB allowed."});
                }
            } catch (error) {
                throw (error instanceof CustomError) ?  error : new Error('An error occurred while checking upload limit. Please try again later.');
            }
        },
        getFileById: async (id: number) => {
            const [rows] = await database.execute("SELECT * FROM files WHERE id = ?", [id]);
            
            //@ts-ignore
            return rows.length ? (rows[0] as FileInterface) : null;
        },
        deleteFile: async (id: number) => {
            await database.execute("DELETE FROM files WHERE id = ?", [id]);
        },
        getUserFiles: async (userId: number) => {
            const [rows] = await database.execute("SELECT * FROM files WHERE user_id = ?", [userId]);
            return rows as FileInterface[];
        },
        updateUserSpace: async (userId: number, fileSize: number) => {
            await database.execute("UPDATE users SET used_space = used_space + ? WHERE id = ?", [fileSize, userId]);
        },
    };
}
