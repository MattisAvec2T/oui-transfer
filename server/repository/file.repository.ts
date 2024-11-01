import { Pool } from "mysql2/promise";
import { FileInterface, FileRepositoryInterface } from "../types/file";
import { UserInterface } from "types/user";
import CustomError from "errors/custom.error";
import crypto from 'crypto';
import { ResultSetHeader } from 'mysql2';

export function fileRepository(database: Pool): FileRepositoryInterface {
  return {
    saveFile: async (
      file: FileInterface,
      user: UserInterface
    ): Promise<FileInterface | void> => {
      try {
        await database.execute(
          "INSERT INTO files (user_id, file_name, file_path, file_size) VALUES ((SELECT id FROM users WHERE mail = ?), ?, ?, ?)",
          [user.mail, file.fileName, file.filePath, file.fileSize]
        );
        return file;
      } catch (error: any) {
        throw new Error(
          "An error occurred while creating a file. Please try again later."
        );
      }
    },
    checkUploadLimit: async (
      file: FileInterface,
      user: UserInterface
    ): Promise<FileInterface | void> => {
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
        if (rows[0].total_size < 2147483648) {
          //2Go
          return file;
        } else {
          throw new CustomError({
            code: 413,
            message: "Upload limit exceeded. Maximum 2GB allowed.",
          });
        }
      } catch (error) {
        throw error instanceof CustomError
          ? error
          : new Error(
              "An error occurred while checking upload limit. Please try again later."
            );
      }
    },
    deleteFile: async (file: FileInterface, user: UserInterface): Promise<void> => {
        try {
            const [rows] = await database.execute(
                "SELECT COUNT(*) as count FROM files WHERE user_id = (SELECT id FROM users WHERE mail = ?) AND file_path = ?",
                [user.mail, file.filePath]
            );
            //@ts-ignore
            if (rows[0].count === 0) {
                throw new CustomError({
                    code: 410,
                    message: "The file has already been deleted or does not exist.",
                  });
            }
    
            await database.execute(
                "DELETE FROM files WHERE user_id = (SELECT id FROM users WHERE mail = ?) AND file_path = ?",
                [user.mail, file.filePath]
            );
        } catch (error) {
            throw error instanceof CustomError
            ? error
            : new Error("An error occurred while deleting files. Please try again later.");
        }
    },
    getUserFiles: async (user: UserInterface): Promise<FileInterface[]> => {
      try {
        const [rows] = await database.execute(
          "SELECT * FROM files WHERE user_id = (SELECT id FROM users WHERE mail = ?)",
          [user.mail]
        );
        return rows as FileInterface[];
      } catch (error) {
        throw new Error(
          "An error occurred while searching files. Please try again later."
        );
      }
    },
    generateDownloadLink: async (files: FileInterface[], user: UserInterface): Promise<string> => {
      try {
        const uniqueKey = crypto.randomBytes(16).toString('hex');
        const [result] = await database.execute<ResultSetHeader>(
          "INSERT INTO links (unique_key) VALUES (?)",
          [uniqueKey]
        );
        const linkId = result.insertId;

        await Promise.all(
          files.map(file =>
            database.execute(
              "INSERT INTO file_link_associations (link_id, file_id) VALUES (?, (SELECT id FROM files WHERE file_path = ?))",
              [linkId, file.filePath]
            )
          )
        );
        return uniqueKey;
      } catch (error) {
        throw new Error("Erreur lors de la création du lien de téléchargement");
      }
    },
    getDownloadLinkFiles: async (uniqueKey: string): Promise<FileInterface[]> => {
      try {
        const [files] = await database.execute(
          `
          SELECT f.file_name, f.file_path
          FROM files f
          JOIN file_link_associations fl ON f.id = fl.file_id
          JOIN links l ON l.id = fl.link_id
          WHERE l.unique_key = ?
          AND expired_date > CURRENT_TIMESTAMP
          `,
          [uniqueKey]
        );
        
        // @ts-ignore
        if (files.length === 0) {
          const [rows] = await database.execute(
            `
            SELECT f.file_name, f.file_path
            FROM files f
            JOIN file_link_associations fl ON f.id = fl.file_id
            JOIN links l ON l.id = fl.link_id
            WHERE l.unique_key = ?
            `,
            [uniqueKey]
          );
          // @ts-ignore
          if (rows.length > 0) {
            await database.execute(
              "DELETE FROM links WHERE unique_key = ?",
              [uniqueKey]
            );
            throw new CustomError({ code: 410, message: "Le lien est arrivé à expiration"})
          } else {
            throw new CustomError({ code: 404, message: "Les fichiers solicités n'existent plus"})
          }
        }
        
        // @ts-ignore
        return files.map((file: { file_name: string; file_path: string }) => ({
          fileName: file.file_name,
          filePath: file.file_path
        }));
      } catch (error) {
        throw (error instanceof CustomError) ?  error : new Error("Erreur lors de la création du lien de téléchargement");
      }
    }
  };
}
