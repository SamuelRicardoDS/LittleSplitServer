export abstract class BaseError extends Error {
    abstract statusCode: number;
    abstract isOperational: boolean;

    constructor(public message: string) {
        super(message);
        Object.setPrototypeOf(this, BaseError.prototype);
        Error.captureStackTrace(this);
    }

    abstract serializeErrors(): { message: string; field?: string }[];
}