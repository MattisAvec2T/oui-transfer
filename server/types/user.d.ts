export interface UserInterface {
    username?: string,
    mail: string | undefined,
    password?: string
}

export interface UserRepositoryInterface {
    getOne: (id: number) => Promise<UserInterface>
    insert: (user: UserInterface) => Promise<UserInterface | void>
    getByMailPassword: (user: UserInterface) => Promise<UserInterface | void>
}
