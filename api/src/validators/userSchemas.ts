import { z } from "zod";
import { Role } from "@prisma/client";

const nonEmptyString = z.string().trim().min(1, "Campo obrigatório");

export const createUserSchema = z.object({
    name: nonEmptyString,
    email: z.string().trim().email("Invalid e-mail"),
    password: z.string().min(8, "Password must contain at least 8 characters"),
    companyId: z.string().uuid("Invalid company ID"),
});

export const updateUserSchema = z
    .object({
        name: nonEmptyString.optional(),
        companyId: z.string().uuid("Invalid company ID").optional(),
        role: z.nativeEnum(Role).optional(),
    })
    .refine((data) => Object.values(data).some((value) => value !== undefined), {
        message: "Enter at least one field to update",
        path: ["body"],
    });

export const authenticateUserSchema = z.object({
    email: z.string().trim().email("Invalid e-mail"),
    password: nonEmptyString,
});

export const userIdParamSchema = z.object({
    id: z.string().uuid("Invalid user ID"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type AuthenticateUserInput = z.infer<typeof authenticateUserSchema>;
export type UserIdParamInput = z.infer<typeof userIdParamSchema>;
