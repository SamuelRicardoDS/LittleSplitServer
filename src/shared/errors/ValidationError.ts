import { logger } from "../logger";
import { BaseError } from "./BaseError";

export class ValidationError extends BaseError {
    statusCode = 400;
    isOperational = true;

    constructor(public errors: { message: string; field?: string }[]) {
        super('Invalid Request Parameters');
        logger.warn(`Erro de validação: ${this.errors.map(e => e.message).join(', ')}`);
        Object.setPrototypeOf(this, ValidationError.prototype);
    }

    serializeErrors(): { message: string; field?: string }[] {
        return this.errors;
    }
}