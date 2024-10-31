export interface UserInterface {
    id?: number,
    title: string,
    completed: boolean
}

export interface UserRepositoryInterface {
    getAll: () => Promise<UserInterface[]>
    getOne: (id: number) => Promise<UserInterface>
    insert: (user: UserInterface) => Promise<UserInterface>
    update: (user: UserInterface) => Promise<UserInterface>
    delete: (id: number) => Promise<void>
}
