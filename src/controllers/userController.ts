import { Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";
import userService from "../services/userService";
import { ApplicationError, ValidationError } from "../errors/applicationError";
import {
    authenticateUserSchema,
    createUserSchema,
    updateUserSchema,
    userIdParamSchema,
} from "../validators/userSchemas";

const userController = {
    async create(req: Request, res: Response): Promise<void> {
        try {
            const payload = parseWithZod(createUserSchema, req.body);
            const user = await userService.createUser(payload);
            res.status(201).json(user);
        } catch (error) {
            handleControllerError(res, error);
        }
    },

    async list(_req: Request, res: Response): Promise<void> {
        try {
            const users = await userService.getUsers();
            res.json(users);
        } catch (error) {
            handleControllerError(res, error);
        }
    },

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = parseWithZod(userIdParamSchema, req.params);
            const user = await userService.getUserById(id);
            res.json(user);
        } catch (error) {
            handleControllerError(res, error);
        }
    },

    async update(req: Request, res: Response): Promise<void> {
        try {
            const { id } = parseWithZod(userIdParamSchema, req.params);
            const payload = parseWithZod(updateUserSchema, req.body ?? {});

            const user = await userService.updateUser(id, payload);
            res.json(user);
        } catch (error) {
            handleControllerError(res, error);
        }
    },

    async remove(req: Request, res: Response): Promise<void> {
        try {
            const { id } = parseWithZod(userIdParamSchema, req.params);
            await userService.deleteUser(id);
            res.status(204).send();
        } catch (error) {
            handleControllerError(res, error);
        }
    },

    async authenticate(req: Request, res: Response): Promise<void> {
        try {
            const payload = parseWithZod(authenticateUserSchema, req.body);
            const user = await userService.verifyCredentials(payload.email, payload.password);
            res.json(user);
        } catch (error) {
            handleControllerError(res, error);
        }
    },
};

function handleControllerError(res: Response, error: unknown): void {
    if (error instanceof ApplicationError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
    }

    console.error(error);
    res.status(500).json({ message: "Server error" });
}

function parseWithZod<T>(schema: ZodSchema<T>, payload: unknown): T {
    try {
        return schema.parse(payload);
    } catch (error) {
        if (error instanceof ZodError) {
            throw new ValidationError(formatZodIssues(error));
        }

        throw error;
    }
}

function formatZodIssues(error: ZodError): string {
    return error.issues
        .map((issue) => {
            const path = issue.path.join(".") || "valor";
            return `${path}: ${issue.message}`;
        })
        .join("; ");
}

export default userController;
