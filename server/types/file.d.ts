import { UserInterface } from "./user";

export interface FileInterface {
    fileName?: string;
    filePath: string;
    fileSize?: number;
    createdAt?: Date;
}

export interface FileRepositoryInterface {
    getDownloadLinkFiles(uniqueKey: string): FileInterface[] | PromiseLike<FileInterface[]>;
    saveFile: (file: FileInterface, user: UserInterface) => Promise<FileInterface | void>;
    checkUploadLimit: (file: FileInterface, user: UserInterface) => Promise<FileInterface | void>;
    deleteFile: (file: FileInterface, user: UserInterface) => Promise<void>;
    updateFile: (file: FileInterface, user: UserInterface) => Promise<void>;
    getUserFiles: (user: UserInterface) => Promise<FileInterface[]>;
    generateDownloadLink: (files: FileInterface[], user: UserInterface) => Promise<string>;
}
