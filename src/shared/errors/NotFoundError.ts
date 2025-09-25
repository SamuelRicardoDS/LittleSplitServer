import { BaseError } from "./BaseError";


export class NotFoundError extends BaseError {
    statusCode = 404;
    isOperational = true;

    constructor(public resource: string) {
        super(`${resource} not found`);
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }

    serializeErrors() {
        return [{ message: `${this.resource} not found`}];
    }
}