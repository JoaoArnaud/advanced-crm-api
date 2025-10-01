"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../db/prisma"));
const prisma_2 = require("../generated/prisma");
const passwordHasher_1 = require("../security/passwordHasher");
const applicationError_1 = require("../errors/applicationError");
const userBaseSelect = {
    id: true,
    name: true,
    email: true,
    role: true,
    companyId: true,
    createdAt: true,
    updatedAt: true,
};
const userService = {
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const existing = yield prisma_1.default.user.findUnique({ where: { email: data.email } });
            if (existing) {
                throw new applicationError_1.ConflictError("E-mail já cadastrado");
            }
            const passwordHash = yield (0, passwordHasher_1.hashPassword)(data.password);
            return prisma_1.default.user.create({
                data: {
                    name: data.name,
                    email: data.email,
                    passwordHash,
                    role: prisma_2.Role.USER,
                    company: { connect: { id: data.companyId } },
                },
                select: userBaseSelect,
            });
        });
    },
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.user.findMany({ select: userBaseSelect });
        });
    },
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma_1.default.user.findUnique({ where: { id }, select: userBaseSelect });
            if (!user) {
                throw new applicationError_1.NotFoundError("Usuário não encontrado");
            }
            return user;
        });
    },
    updateUser(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateData = buildUpdatePayload(data);
            if (!hasAtLeastOneField(updateData)) {
                throw new applicationError_1.ValidationError("Nenhum campo válido para atualizar");
            }
            try {
                return yield prisma_1.default.user.update({
                    where: { id },
                    data: updateData,
                    select: userBaseSelect,
                });
            }
            catch (error) {
                mapAndThrowPrismaError(error);
            }
        });
    },
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield prisma_1.default.user.delete({ where: { id } });
            }
            catch (error) {
                mapAndThrowPrismaError(error);
            }
        });
    },
    verifyCredentials(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma_1.default.user.findUnique({
                where: { email },
                select: Object.assign(Object.assign({}, userBaseSelect), { passwordHash: true }),
            });
            if (!user) {
                throw new applicationError_1.AuthenticationError();
            }
            const isValid = yield (0, passwordHasher_1.verifyPassword)(user.passwordHash, password);
            if (!isValid) {
                throw new applicationError_1.AuthenticationError();
            }
            const { passwordHash } = user, safeUser = __rest(user, ["passwordHash"]);
            return safeUser;
        });
    },
};
function buildUpdatePayload(data) {
    const updateData = {};
    if (typeof data.name === "string") {
        updateData.name = data.name;
    }
    if (typeof data.companyId === "string") {
        updateData.company = { connect: { id: data.companyId } };
    }
    if (typeof data.role !== "undefined") {
        updateData.role = data.role;
    }
    return updateData;
}
function hasAtLeastOneField(data) {
    return Boolean(data.name || data.company || data.role);
}
function mapAndThrowPrismaError(error) {
    if (error instanceof prisma_2.Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        throw new applicationError_1.NotFoundError("Usuário não encontrado");
    }
    if (error instanceof Error) {
        throw error;
    }
    throw new Error("Erro inesperado ao acessar o banco de dados");
}
exports.default = userService;
