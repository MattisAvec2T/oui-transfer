import { UserRepositoryInterface } from "./user";
import { FileRepositoryInterface } from "./file";

export interface Repository {
    UserRepository: UserRepositoryInterface
    FileRepository: FileRepositoryInterface
}
