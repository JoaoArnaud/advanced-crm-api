import { Request, Response } from "express";
import { ZodError, ZodSchema, z } from "zod";
import companyService from "../services/companyService";
import { ApplicationError, ValidationError } from "../errors/applicationError";

const nonEmptyString = z.string().trim().min(1, "Campo obrigatório");
const emailSchema = z.string().trim().email("Invalid e-mail");
const phoneSchema = z.string().trim().min(1, "Phone cannot be empty");

const createCompanySchema = z.object({
    name: nonEmptyString,
    email: emailSchema.optional().nullable(),
    phone: phoneSchema.optional().nullable(),
});

const updateCompanySchema = z
    .object({
        name: nonEmptyString.optional(),
        email: emailSchema.optional().nullable(),
        phone: phoneSchema.optional().nullable(),
    })
    .refine((data) => Object.values(data).some((value) => value !== undefined), {
        message: "Enter at least one field to update",
        path: ["body"],
    });

const companyIdParamSchema = z.object({
    id: z.string().uuid("Invalid company ID"),
});

const companyController = {
    async create(req: Request, res: Response): Promise<void> {
        try {
            const payload = parseWithZod(createCompanySchema, req.body);
            const company = await companyService.createCompany(payload);
            res.status(201).json(company);
        } catch (error) {
            handleControllerError(res, error);
        }
    },

    async list(_req: Request, res: Response): Promise<void> {
        try {
            const companies = await companyService.getCompanies();
            res.json(companies);
        } catch (error) {
            handleControllerError(res, error);
        }
    },

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = parseWithZod(companyIdParamSchema, req.params);
            const company = await companyService.getCompanyById(id);
            res.json(company);
        } catch (error) {
            handleControllerError(res, error);
        }
    },

    async update(req: Request, res: Response): Promise<void> {
        try {
            const { id } = parseWithZod(companyIdParamSchema, req.params);
            const payload = parseWithZod(updateCompanySchema, req.body ?? {});
            const company = await companyService.updateCompany(id, payload);
            res.json(company);
        } catch (error) {
            handleControllerError(res, error);
        }
    },

    async remove(req: Request, res: Response): Promise<void> {
        try {
            const { id } = parseWithZod(companyIdParamSchema, req.params);
            await companyService.deleteCompany(id);
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
    res.status(500).json({ message: "Erro interno do servidor" });
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

export default companyController;
