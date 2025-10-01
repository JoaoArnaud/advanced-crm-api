export abstract class ApplicationError extends Error {
    public readonly statusCode: number;

    protected constructor(message: string, statusCode: number) {
        super(message);
        this.name = new.target.name;
        this.statusCode = statusCode;
        Error.captureStackTrace?.(this, new.target);
    }
}

export class ConflictError extends ApplicationError {
    constructor(message = "Resource already exists") {
        super(message, 409);
    }
}

export class NotFoundError extends ApplicationError {
    constructor(message = "Resource not found") {
        super(message, 404);
    }
}

export class AuthenticationError extends ApplicationError {
    constructor(message = "Invalid credentials") {
        super(message, 401);
    }
}

export class ValidationError extends ApplicationError {
    constructor(message = "Validation failed") {
        super(message, 400);
    }
}
