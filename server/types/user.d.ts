export interface UserInterface {
    username?: string,
    mail: string,
    password: string
}

export interface UserRepositoryInterface {
    getOne: (id: number) => Promise<UserInterface>
    insert: (user: UserInterface) => Promise<UserInterface | Error>
    getByMailPassword: (user: UserInterface) => Promise<UserInterface | void>
}
