import { z } from "zod";
import { LeadStatus } from "../generated/prisma";

const nonEmptyString = z.string().trim().min(1, "Campo obrigatório");
const optionalString = z.string().trim().min(1, "Campo obrigatório").optional().nullable();

export const createLeadSchema = z.object({
    name: nonEmptyString,
    email: z.string().trim().email("Invalid e-mail").optional().nullable(),
    phone: optionalString,
    status: z.nativeEnum(LeadStatus).optional(),
    cnpj: optionalString,
    cpf: optionalString,
});

export const updateLeadSchema = z
    .object({
        name: nonEmptyString.optional(),
        email: z.string().trim().email("Invalid e-mail").optional().nullable(),
        phone: optionalString,
        status: z.nativeEnum(LeadStatus).optional(),
        cnpj: optionalString,
        cpf: optionalString,
    })
    .refine((data) => Object.values(data).some((value) => value !== undefined), {
        message: "Enter at least one field to update",
        path: ["body"],
    });

export const leadCompanyParamSchema = z.object({
    companyId: z.string().uuid("Invalid company ID"),
});

export const leadIdParamSchema = z.object({
    companyId: z.string().uuid("Invalid company ID"),
    leadId: z.coerce.number().int("Lead ID must be an integer").positive("Lead ID must be positive"),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
export type LeadCompanyParamInput = z.infer<typeof leadCompanyParamSchema>;
export type LeadIdParamInput = z.infer<typeof leadIdParamSchema>;
