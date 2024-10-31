interface DatabaseErrorInterface extends Error {
    code: number;
}

export default class DatabaseError extends Error implements DatabaseErrorInterface {
    public readonly code: number;

    public constructor(errorParams: { code?: number, message?: string }) {
        const {code, message} = errorParams;
        super(message || "Database Error");
        this.code = code || 500;
    }
}