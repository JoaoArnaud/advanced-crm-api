"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = exports.AuthenticationError = exports.NotFoundError = exports.ConflictError = exports.ApplicationError = void 0;
class ApplicationError extends Error {
    constructor(message, statusCode) {
        var _a;
        super(message);
        this.name = new.target.name;
        this.statusCode = statusCode;
        (_a = Error.captureStackTrace) === null || _a === void 0 ? void 0 : _a.call(Error, this, new.target);
    }
}
exports.ApplicationError = ApplicationError;
class ConflictError extends ApplicationError {
    constructor(message = "Resource already exists") {
        super(message, 409);
    }
}
exports.ConflictError = ConflictError;
class NotFoundError extends ApplicationError {
    constructor(message = "Resource not found") {
        super(message, 404);
    }
}
exports.NotFoundError = NotFoundError;
class AuthenticationError extends ApplicationError {
    constructor(message = "Invalid credentials") {
        super(message, 401);
    }
}
exports.AuthenticationError = AuthenticationError;
class ValidationError extends ApplicationError {
    constructor(message = "Validation failed") {
        super(message, 400);
    }
}
exports.ValidationError = ValidationError;
