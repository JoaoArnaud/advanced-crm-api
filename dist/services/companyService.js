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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../db/prisma"));
const prisma_2 = require("../generated/prisma");
const applicationError_1 = require("../errors/applicationError");
const companyBaseSelect = {
    id: true,
    name: true,
    email: true,
    phone: true,
    createdAt: true,
    updatedAt: true,
};
const companyService = {
    createCompany(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            return prisma_1.default.company.create({
                data: {
                    name: data.name,
                    email: (_a = data.email) !== null && _a !== void 0 ? _a : null,
                    phone: (_b = data.phone) !== null && _b !== void 0 ? _b : null,
                },
                select: companyBaseSelect,
            });
        });
    },
    getCompanies() {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.company.findMany({ select: companyBaseSelect });
        });
    },
    getCompanyById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const company = yield prisma_1.default.company.findUnique({ where: { id }, select: companyBaseSelect });
            if (!company) {
                throw new applicationError_1.NotFoundError("Company not found");
            }
            return company;
        });
    },
    updateCompany(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!hasAtLeastOneField(data)) {
                throw new applicationError_1.ValidationError("No valid field to update");
            }
            const updateData = buildUpdatePayload(data);
            try {
                return yield prisma_1.default.company.update({
                    where: { id },
                    data: updateData,
                    select: companyBaseSelect,
                });
            }
            catch (error) {
                mapAndThrowPrismaError(error);
            }
        });
    },
    deleteCompany(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield prisma_1.default.company.delete({ where: { id } });
            }
            catch (error) {
                mapAndThrowPrismaError(error);
            }
        });
    },
};
function buildUpdatePayload(data) {
    var _a, _b;
    const updateData = {};
    if (typeof data.name === "string") {
        updateData.name = data.name;
    }
    if (typeof data.email !== "undefined") {
        updateData.email = (_a = data.email) !== null && _a !== void 0 ? _a : null;
    }
    if (typeof data.phone !== "undefined") {
        updateData.phone = (_b = data.phone) !== null && _b !== void 0 ? _b : null;
    }
    return updateData;
}
function hasAtLeastOneField(data) {
    return Object.values(data).some((value) => value !== undefined);
}
function mapAndThrowPrismaError(error) {
    if (error instanceof prisma_2.Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        throw new applicationError_1.NotFoundError("Company not found");
    }
    if (error instanceof Error) {
        throw error;
    }
    throw new Error("Unexpected error when acessing database");
}
exports.default = companyService;
