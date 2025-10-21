import { Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";
import leadService from "../services/leadService";
import { ApplicationError, ValidationError } from "../errors/applicationError";
import {
    createLeadSchema,
    leadCompanyParamSchema,
    leadIdParamSchema,
    updateLeadSchema,
} from "../validators/leadSchemas";

const leadController = {
    async create(req: Request, res: Response): Promise<void> {
        try {
            const { companyId } = parseWithZod(leadCompanyParamSchema, req.params);
            const payload = parseWithZod(createLeadSchema, req.body);
            const lead = await leadService.createLead(companyId, payload);
            res.status(201).json(lead);
        } catch (error) {
            handleControllerError(res, error);
        }
    },

    async list(req: Request, res: Response): Promise<void> {
        try {
            const { companyId } = parseWithZod(leadCompanyParamSchema, req.params);
            const leads = await leadService.getLeadsByCompany(companyId);
            res.json(leads);
        } catch (error) {
            handleControllerError(res, error);
        }
    },

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const { companyId, leadId } = parseWithZod(leadIdParamSchema, req.params);
            const lead = await leadService.getLeadById(companyId, leadId);
            res.json(lead);
        } catch (error) {
            handleControllerError(res, error);
        }
    },

    async update(req: Request, res: Response): Promise<void> {
        try {
            const { companyId, leadId } = parseWithZod(leadIdParamSchema, req.params);
            const payload = parseWithZod(updateLeadSchema, req.body ?? {});
            const lead = await leadService.updateLead(companyId, leadId, payload);
            res.json(lead);
        } catch (error) {
            handleControllerError(res, error);
        }
    },

    async remove(req: Request, res: Response): Promise<void> {
        try {
            const { companyId, leadId } = parseWithZod(leadIdParamSchema, req.params);
            await leadService.deleteLead(companyId, leadId);
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

export default leadController;
