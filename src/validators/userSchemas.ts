import { z } from "zod";
import { Role } from "../generated/prisma";

const nonEmptyString = z.string().trim().min(1, "Campo obrigatório");

export const createUserSchema = z.object({
    name: nonEmptyString,
    email: z.string().trim().email("E-mail inválido"),
    password: z.string().min(8, "Senha deve conter ao menos 8 caracteres"),
    companyId: z.string().uuid("ID da empresa inválido"),
});

export const updateUserSchema = z
    .object({
        name: nonEmptyString.optional(),
        companyId: z.string().uuid("ID da empresa inválido").optional(),
        role: z.nativeEnum(Role).optional(),
    })
    .refine((data) => Object.values(data).some((value) => value !== undefined), {
        message: "Informe ao menos um campo para atualizar",
        path: ["body"],
    });

export const authenticateUserSchema = z.object({
    email: z.string().trim().email("E-mail inválido"),
    password: nonEmptyString,
});

export const userIdParamSchema = z.object({
    id: z.string().uuid("ID do usuário inválido"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type AuthenticateUserInput = z.infer<typeof authenticateUserSchema>;
export type UserIdParamInput = z.infer<typeof userIdParamSchema>;
