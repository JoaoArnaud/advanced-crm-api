import { Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";
import clientService from "../services/clientService";
import { ApplicationError, ValidationError } from "../errors/applicationError";
import {
    clientCompanyParamSchema,
    clientIdParamSchema,
    createClientSchema,
    updateClientSchema,
} from "../validators/clientSchemas";

const clientController = {
    async create(req: Request, res: Response): Promise<void> {
        try {
            const { companyId } = parseWithZod(clientCompanyParamSchema, req.params);
            const payload = parseWithZod(createClientSchema, req.body);
            const client = await clientService.createClient(companyId, payload);
            res.status(201).json(client);
        } catch (error) {
            handleControllerError(res, error);
        }
    },

    async list(req: Request, res: Response): Promise<void> {
        try {
            const { companyId } = parseWithZod(clientCompanyParamSchema, req.params);
            const clients = await clientService.getClientsByCompany(companyId);
            res.json(clients);
        } catch (error) {
            handleControllerError(res, error);
        }
    },

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const { companyId, clientId } = parseWithZod(clientIdParamSchema, req.params);
            const client = await clientService.getClientById(companyId, clientId);
            res.json(client);
        } catch (error) {
            handleControllerError(res, error);
        }
    },

    async update(req: Request, res: Response): Promise<void> {
        try {
            const { companyId, clientId } = parseWithZod(clientIdParamSchema, req.params);
            const payload = parseWithZod(updateClientSchema, req.body ?? {});
            const client = await clientService.updateClient(companyId, clientId, payload);
            res.json(client);
        } catch (error) {
            handleControllerError(res, error);
        }
    },

    async remove(req: Request, res: Response): Promise<void> {
        try {
            const { companyId, clientId } = parseWithZod(clientIdParamSchema, req.params);
            await clientService.deleteClient(companyId, clientId);
            res.status(204).send();
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

export default clientController;
