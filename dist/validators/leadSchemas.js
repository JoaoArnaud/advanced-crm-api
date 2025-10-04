"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leadIdParamSchema = exports.leadCompanyParamSchema = exports.updateLeadSchema = exports.createLeadSchema = void 0;
const zod_1 = require("zod");
const prisma_1 = require("../generated/prisma");
const nonEmptyString = zod_1.z.string().trim().min(1, "Campo obrigatório");
const optionalString = zod_1.z.string().trim().min(1, "Campo obrigatório").optional().nullable();
exports.createLeadSchema = zod_1.z.object({
    name: nonEmptyString,
    email: zod_1.z.string().trim().email("Invalid e-mail").optional().nullable(),
    phone: optionalString,
    status: zod_1.z.nativeEnum(prisma_1.LeadStatus).optional(),
    cnpj: optionalString,
    cpf: optionalString,
});
exports.updateLeadSchema = zod_1.z
    .object({
    name: nonEmptyString.optional(),
    email: zod_1.z.string().trim().email("Invalid e-mail").optional().nullable(),
    phone: optionalString,
    status: zod_1.z.nativeEnum(prisma_1.LeadStatus).optional(),
    cnpj: optionalString,
    cpf: optionalString,
})
    .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "Enter at least one field to update",
    path: ["body"],
});
exports.leadCompanyParamSchema = zod_1.z.object({
    companyId: zod_1.z.string().uuid("Invalid company ID"),
});
exports.leadIdParamSchema = zod_1.z.object({
    companyId: zod_1.z.string().uuid("Invalid company ID"),
    leadId: zod_1.z.coerce.number().int("Lead ID must be an integer").positive("Lead ID must be positive"),
});
