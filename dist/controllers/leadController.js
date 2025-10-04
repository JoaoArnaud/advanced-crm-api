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
const leadService_1 = __importDefault(require("../services/leadService"));
const applicationError_1 = require("../errors/applicationError");
const leadSchemas_1 = require("../validators/leadSchemas");
const leadController = {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { companyId } = parseWithZod(leadSchemas_1.leadCompanyParamSchema, req.params);
                const payload = parseWithZod(leadSchemas_1.createLeadSchema, req.body);
                const lead = yield leadService_1.default.createLead(companyId, payload);
                res.status(201).json(lead);
            }
            catch (error) {
                handleControllerError(res, error);
            }
        });
    },
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { companyId } = parseWithZod(leadSchemas_1.leadCompanyParamSchema, req.params);
                const leads = yield leadService_1.default.getLeadsByCompany(companyId);
                res.json(leads);
            }
            catch (error) {
                handleControllerError(res, error);
            }
        });
    },
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { companyId, leadId } = parseWithZod(leadSchemas_1.leadIdParamSchema, req.params);
                const lead = yield leadService_1.default.getLeadById(companyId, leadId);
                res.json(lead);
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
                const { companyId, leadId } = parseWithZod(leadSchemas_1.leadIdParamSchema, req.params);
                const payload = parseWithZod(leadSchemas_1.updateLeadSchema, (_a = req.body) !== null && _a !== void 0 ? _a : {});
                const lead = yield leadService_1.default.updateLead(companyId, leadId, payload);
                res.json(lead);
            }
            catch (error) {
                handleControllerError(res, error);
            }
        });
    },
    remove(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { companyId, leadId } = parseWithZod(leadSchemas_1.leadIdParamSchema, req.params);
                yield leadService_1.default.deleteLead(companyId, leadId);
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
exports.default = leadController;
