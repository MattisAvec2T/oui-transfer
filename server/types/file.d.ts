import { UserInterface } from "./user";

export interface FileInterface {
    fileName: string;
    filePath: string;
    fileSize: number;
    createdAt?: Date;
}

export interface FileRepositoryInterface {
    saveFile: (file: FileInterface, user: UserInterface) => Promise<FileInterface | void>;
    checkUploadLimit: (file: FileInterface, user: UserInterface) => Promise<FileInterface | void>;
    getFileById: (id: number) => Promise<FileInterface | null>;
    deleteFile: (file: FileInterface, user: UserInterface) => Promise<void>;
    getUserFiles: (user: UserInterface) => Promise<FileInterface[]>;
    updateUserSpace: (userId: number, fileSize: number) => Promise<void>;
}
