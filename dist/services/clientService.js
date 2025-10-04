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
const clientBaseSelect = {
    id: true,
    name: true,
    email: true,
    phone: true,
    cnpj: true,
    companyId: true,
    leadOriginId: true,
    leadOrigin: {
        select: {
            id: true,
            name: true,
            status: true,
        },
    },
    createdAt: true,
    updatedAt: true,
};
const clientService = {
    createClient(companyId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            if (typeof data.leadOriginId === "number") {
                yield validateLeadBelongsToCompany(companyId, data.leadOriginId);
            }
            const leadOriginConnection = typeof data.leadOriginId === "number"
                ? { leadOrigin: { connect: { id: data.leadOriginId } } }
                : {};
            return prisma_1.default.clients.create({
                data: Object.assign({ name: data.name, email: (_a = data.email) !== null && _a !== void 0 ? _a : null, phone: (_b = data.phone) !== null && _b !== void 0 ? _b : null, cnpj: (_c = data.cnpj) !== null && _c !== void 0 ? _c : null, company: { connect: { id: companyId } } }, leadOriginConnection),
                select: clientBaseSelect,
            });
        });
    },
    getClientsByCompany(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.clients.findMany({
                where: { companyId },
                select: clientBaseSelect,
            });
        });
    },
    getClientById(companyId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield prisma_1.default.clients.findFirst({
                where: { id, companyId },
                select: clientBaseSelect,
            });
            if (!client) {
                throw new applicationError_1.NotFoundError("Client not found");
            }
            return client;
        });
    },
    updateClient(companyId, id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            if (!hasAtLeastOneField(data)) {
                throw new applicationError_1.ValidationError("No valid field to update");
            }
            yield this.getClientById(companyId, id);
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
            if (typeof data.cnpj !== "undefined") {
                updateData.cnpj = (_c = data.cnpj) !== null && _c !== void 0 ? _c : null;
            }
            if (typeof data.leadOriginId !== "undefined") {
                if (data.leadOriginId === null) {
                    updateData.leadOrigin = { disconnect: true };
                }
                else {
                    yield validateLeadBelongsToCompany(companyId, data.leadOriginId);
                    updateData.leadOrigin = { connect: { id: data.leadOriginId } };
                }
            }
            try {
                return yield prisma_1.default.clients.update({
                    where: { id },
                    data: updateData,
                    select: clientBaseSelect,
                });
            }
            catch (error) {
                mapAndThrowPrismaError(error);
            }
        });
    },
    deleteClient(companyId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getClientById(companyId, id);
            try {
                yield prisma_1.default.clients.delete({ where: { id } });
            }
            catch (error) {
                mapAndThrowPrismaError(error);
            }
        });
    },
};
function hasAtLeastOneField(data) {
    return Object.values(data).some((value) => value !== undefined);
}
function validateLeadBelongsToCompany(companyId, leadId) {
    return __awaiter(this, void 0, void 0, function* () {
        const lead = yield prisma_1.default.leads.findFirst({ where: { id: leadId, companyId }, select: { id: true } });
        if (!lead) {
            throw new applicationError_1.ValidationError("Lead origin not found for this company");
        }
    });
}
function mapAndThrowPrismaError(error) {
    if (error instanceof prisma_2.Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        throw new applicationError_1.NotFoundError("Client not found");
    }
    if (error instanceof Error) {
        throw error;
    }
    throw new Error("Unexpected error when accessing database");
}
exports.default = clientService;
