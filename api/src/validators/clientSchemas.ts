import { z } from "zod";

const nonEmptyString = z.string().trim().min(1, "Campo obrigatório");
const optionalString = z.string().trim().min(1, "Campo obrigatório").optional().nullable();

export const createClientSchema = z.object({
    name: nonEmptyString,
    email: z.string().trim().email("Invalid e-mail").optional().nullable(),
    phone: optionalString,
    cnpj: optionalString,
    leadOriginId: z
        .coerce
        .number()
        .int("Lead origin ID must be an integer")
        .positive("Lead origin ID must be positive")
        .optional(),
});

export const updateClientSchema = z
    .object({
        name: nonEmptyString.optional(),
        email: z.string().trim().email("Invalid e-mail").optional().nullable(),
        phone: optionalString,
        cnpj: optionalString,
        leadOriginId: z
            .union([
                z
                    .coerce
                    .number()
                    .int("Lead origin ID must be an integer")
                    .positive("Lead origin ID must be positive"),
                z.null(),
            ])
            .optional(),
    })
    .refine((data) => Object.values(data).some((value) => value !== undefined), {
        message: "Enter at least one field to update",
        path: ["body"],
    });

export const clientCompanyParamSchema = z.object({
    companyId: z.string().uuid("Invalid company ID"),
});

export const clientIdParamSchema = z.object({
    companyId: z.string().uuid("Invalid company ID"),
    clientId: z.coerce.number().int("Client ID must be an integer").positive("Client ID must be positive"),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
export type ClientCompanyParamInput = z.infer<typeof clientCompanyParamSchema>;
export type ClientIdParamInput = z.infer<typeof clientIdParamSchema>;
