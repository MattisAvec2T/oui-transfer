interface CustomErrorInterface extends Error {
    code: number;
}

export default class CustomError extends Error implements CustomErrorInterface {
    public readonly code: number;

    public constructor(errorParams: { code?: number, message?: string }) {
        const {code, message} = errorParams;
        super(message || "Custom Error");
        this.code = code || 500;
    }
}