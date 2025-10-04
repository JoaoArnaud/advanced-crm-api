"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientIdParamSchema = exports.clientCompanyParamSchema = exports.updateClientSchema = exports.createClientSchema = void 0;
const zod_1 = require("zod");
const nonEmptyString = zod_1.z.string().trim().min(1, "Campo obrigatório");
const optionalString = zod_1.z.string().trim().min(1, "Campo obrigatório").optional().nullable();
exports.createClientSchema = zod_1.z.object({
    name: nonEmptyString,
    email: zod_1.z.string().trim().email("Invalid e-mail").optional().nullable(),
    phone: optionalString,
    cnpj: optionalString,
    leadOriginId: zod_1.z
        .coerce
        .number()
        .int("Lead origin ID must be an integer")
        .positive("Lead origin ID must be positive")
        .optional(),
});
exports.updateClientSchema = zod_1.z
    .object({
    name: nonEmptyString.optional(),
    email: zod_1.z.string().trim().email("Invalid e-mail").optional().nullable(),
    phone: optionalString,
    cnpj: optionalString,
    leadOriginId: zod_1.z
        .union([
        zod_1.z
            .coerce
            .number()
            .int("Lead origin ID must be an integer")
            .positive("Lead origin ID must be positive"),
        zod_1.z.null(),
    ])
        .optional(),
})
    .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "Enter at least one field to update",
    path: ["body"],
});
exports.clientCompanyParamSchema = zod_1.z.object({
    companyId: zod_1.z.string().uuid("Invalid company ID"),
});
exports.clientIdParamSchema = zod_1.z.object({
    companyId: zod_1.z.string().uuid("Invalid company ID"),
    clientId: zod_1.z.coerce.number().int("Client ID must be an integer").positive("Client ID must be positive"),
});
