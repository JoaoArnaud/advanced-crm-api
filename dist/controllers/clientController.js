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
const zod_1 = require("zod");
const clientService_1 = __importDefault(require("../services/clientService"));
const applicationError_1 = require("../errors/applicationError");
const clientSchemas_1 = require("../validators/clientSchemas");
const clientController = {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { companyId } = parseWithZod(clientSchemas_1.clientCompanyParamSchema, req.params);
                const payload = parseWithZod(clientSchemas_1.createClientSchema, req.body);
                const client = yield clientService_1.default.createClient(companyId, payload);
                res.status(201).json(client);
            }
            catch (error) {
                handleControllerError(res, error);
            }
        });
    },
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { companyId } = parseWithZod(clientSchemas_1.clientCompanyParamSchema, req.params);
                const clients = yield clientService_1.default.getClientsByCompany(companyId);
                res.json(clients);
            }
            catch (error) {
                handleControllerError(res, error);
            }
        });
    },
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { companyId, clientId } = parseWithZod(clientSchemas_1.clientIdParamSchema, req.params);
                const client = yield clientService_1.default.getClientById(companyId, clientId);
                res.json(client);
            }
            catch (error) {
                handleControllerError(res, error);
            }
        });
    },
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { companyId, clientId } = parseWithZod(clientSchemas_1.clientIdParamSchema, req.params);
                const payload = parseWithZod(clientSchemas_1.updateClientSchema, (_a = req.body) !== null && _a !== void 0 ? _a : {});
                const client = yield clientService_1.default.updateClient(companyId, clientId, payload);
                res.json(client);
            }
            catch (error) {
                handleControllerError(res, error);
            }
        });
    },
    remove(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { companyId, clientId } = parseWithZod(clientSchemas_1.clientIdParamSchema, req.params);
                yield clientService_1.default.deleteClient(companyId, clientId);
                res.status(204).send();
            }
            catch (error) {
                handleControllerError(res, error);
            }
        });
    },
};
function handleControllerError(res, error) {
    if (error instanceof applicationError_1.ApplicationError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
    }
    console.error(error);
    res.status(500).json({ message: "Server error" });
}
function parseWithZod(schema, payload) {
    try {
        return schema.parse(payload);
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            throw new applicationError_1.ValidationError(formatZodIssues(error));
        }
        throw error;
    }
}
function formatZodIssues(error) {
    return error.issues
        .map((issue) => {
        const path = issue.path.join(".") || "valor";
        return `${path}: ${issue.message}`;
    })
        .join("; ");
}
exports.default = clientController;
