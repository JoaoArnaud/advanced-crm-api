"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userIdParamSchema = exports.authenticateUserSchema = exports.updateUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
const prisma_1 = require("../generated/prisma");
const nonEmptyString = zod_1.z.string().trim().min(1, "Campo obrigatório");
exports.createUserSchema = zod_1.z.object({
    name: nonEmptyString,
    email: zod_1.z.string().trim().email("E-mail inválido"),
    password: zod_1.z.string().min(8, "Senha deve conter ao menos 8 caracteres"),
    companyId: zod_1.z.string().uuid("ID da empresa inválido"),
});
exports.updateUserSchema = zod_1.z
    .object({
    name: nonEmptyString.optional(),
    companyId: zod_1.z.string().uuid("ID da empresa inválido").optional(),
    role: zod_1.z.nativeEnum(prisma_1.Role).optional(),
})
    .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "Informe ao menos um campo para atualizar",
    path: ["body"],
});
exports.authenticateUserSchema = zod_1.z.object({
    email: zod_1.z.string().trim().email("E-mail inválido"),
    password: nonEmptyString,
});
exports.userIdParamSchema = zod_1.z.object({
    id: zod_1.z.string().uuid("ID do usuário inválido"),
});
