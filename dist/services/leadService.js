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
const leadBaseSelect = {
    id: true,
    name: true,
    email: true,
    phone: true,
    status: true,
    cnpj: true,
    cpf: true,
    companyId: true,
    createdAt: true,
    updatedAt: true,
};
const leadService = {
    createLead(companyId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            return prisma_1.default.leads.create({
                data: {
                    name: data.name,
                    email: (_a = data.email) !== null && _a !== void 0 ? _a : null,
                    phone: (_b = data.phone) !== null && _b !== void 0 ? _b : null,
                    status: (_c = data.status) !== null && _c !== void 0 ? _c : prisma_2.LeadStatus.WARM,
                    cnpj: (_d = data.cnpj) !== null && _d !== void 0 ? _d : null,
                    cpf: (_e = data.cpf) !== null && _e !== void 0 ? _e : null,
                    company: { connect: { id: companyId } },
                },
                select: leadBaseSelect,
            });
        });
    },
    getLeadsByCompany(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.leads.findMany({
                where: { companyId },
                select: leadBaseSelect,
            });
        });
    },
    getLeadById(companyId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const lead = yield prisma_1.default.leads.findFirst({
                where: { id, companyId },
                select: leadBaseSelect,
            });
            if (!lead) {
                throw new applicationError_1.NotFoundError("Lead not found");
            }
            return lead;
        });
    },
    updateLead(companyId, id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!hasAtLeastOneField(data)) {
                throw new applicationError_1.ValidationError("No valid field to update");
            }
            yield this.getLeadById(companyId, id);
            const updateData = buildUpdatePayload(data);
            try {
                return yield prisma_1.default.leads.update({
                    where: { id },
                    data: updateData,
                    select: leadBaseSelect,
                });
            }
            catch (error) {
                mapAndThrowPrismaError(error);
            }
        });
    },
    deleteLead(companyId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getLeadById(companyId, id);
            try {
                yield prisma_1.default.leads.delete({ where: { id } });
            }
            catch (error) {
                mapAndThrowPrismaError(error);
            }
        });
    },
};
function buildUpdatePayload(data) {
    var _a, _b, _c, _d;
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
    if (typeof data.status !== "undefined") {
        updateData.status = data.status;
    }
    if (typeof data.cnpj !== "undefined") {
        updateData.cnpj = (_c = data.cnpj) !== null && _c !== void 0 ? _c : null;
    }
    if (typeof data.cpf !== "undefined") {
        updateData.cpf = (_d = data.cpf) !== null && _d !== void 0 ? _d : null;
    }
    return updateData;
}
function hasAtLeastOneField(data) {
    return Object.values(data).some((value) => value !== undefined);
}
function mapAndThrowPrismaError(error) {
    if (error instanceof prisma_2.Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        throw new applicationError_1.NotFoundError("Lead not found");
    }
    if (error instanceof Error) {
        throw error;
    }
    throw new Error("Unexpected error when accessing database");
}
exports.default = leadService;
