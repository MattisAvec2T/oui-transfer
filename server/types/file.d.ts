import { UserInterface } from "./user";

export interface FileInterface {
    fileName: string;
    filePath: string;
    fileSize: number;
    createdAt?: Date;
}

export interface FileRepositoryInterface {
    saveFile: (file: FileInterface, user: UserInterface) => Promise<FileInterface | Error>;
    checkUploadLimit: (file: FileInterface, user: UserInterface) => Promise<FileInterface | Error>;
    getFileById: (id: number) => Promise<FileInterface | null>;
    deleteFile: (id: number) => Promise<void>;
    getUserFiles: (userId: number) => Promise<FileInterface[]>;
    updateUserSpace: (userId: number, fileSize: number) => Promise<void>;
}
