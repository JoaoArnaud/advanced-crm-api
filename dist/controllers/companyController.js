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
const companyService_1 = __importDefault(require("../services/companyService"));
const applicationError_1 = require("../errors/applicationError");
const nonEmptyString = zod_1.z.string().trim().min(1, "Campo obrigatório");
const emailSchema = zod_1.z.string().trim().email("Invalid e-mail");
const phoneSchema = zod_1.z.string().trim().min(1, "Phone cannot be empty");
const createCompanySchema = zod_1.z.object({
    name: nonEmptyString,
    email: emailSchema.optional().nullable(),
    phone: phoneSchema.optional().nullable(),
});
const updateCompanySchema = zod_1.z
    .object({
    name: nonEmptyString.optional(),
    email: emailSchema.optional().nullable(),
    phone: phoneSchema.optional().nullable(),
})
    .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "Enter at least one field to update",
    path: ["body"],
});
const companyIdParamSchema = zod_1.z.object({
    id: zod_1.z.string().uuid("Invalid company ID"),
});
const companyController = {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = parseWithZod(createCompanySchema, req.body);
                const company = yield companyService_1.default.createCompany(payload);
                res.status(201).json(company);
            }
            catch (error) {
                handleControllerError(res, error);
            }
        });
    },
    list(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const companies = yield companyService_1.default.getCompanies();
                res.json(companies);
            }
            catch (error) {
                handleControllerError(res, error);
            }
        });
    },
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = parseWithZod(companyIdParamSchema, req.params);
                const company = yield companyService_1.default.getCompanyById(id);
                res.json(company);
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
                const { id } = parseWithZod(companyIdParamSchema, req.params);
                const payload = parseWithZod(updateCompanySchema, (_a = req.body) !== null && _a !== void 0 ? _a : {});
                const company = yield companyService_1.default.updateCompany(id, payload);
                res.json(company);
            }
            catch (error) {
                handleControllerError(res, error);
            }
        });
    },
    remove(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = parseWithZod(companyIdParamSchema, req.params);
                yield companyService_1.default.deleteCompany(id);
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
    res.status(500).json({ message: "Erro interno do servidor" });
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
exports.default = companyController;
