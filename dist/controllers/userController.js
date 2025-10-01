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
const userService_1 = __importDefault(require("../services/userService"));
const applicationError_1 = require("../errors/applicationError");
const userSchemas_1 = require("../validators/userSchemas");
const userController = {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = parseWithZod(userSchemas_1.createUserSchema, req.body);
                const user = yield userService_1.default.createUser(payload);
                res.status(201).json(user);
            }
            catch (error) {
                handleControllerError(res, error);
            }
        });
    },
    list(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield userService_1.default.getUsers();
                res.json(users);
            }
            catch (error) {
                handleControllerError(res, error);
            }
        });
    },
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = parseWithZod(userSchemas_1.userIdParamSchema, req.params);
                const user = yield userService_1.default.getUserById(id);
                res.json(user);
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
                const { id } = parseWithZod(userSchemas_1.userIdParamSchema, req.params);
                const payload = parseWithZod(userSchemas_1.updateUserSchema, (_a = req.body) !== null && _a !== void 0 ? _a : {});
                const user = yield userService_1.default.updateUser(id, payload);
                res.json(user);
            }
            catch (error) {
                handleControllerError(res, error);
            }
        });
    },
    remove(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = parseWithZod(userSchemas_1.userIdParamSchema, req.params);
                yield userService_1.default.deleteUser(id);
                res.status(204).send();
            }
            catch (error) {
                handleControllerError(res, error);
            }
        });
    },
    authenticate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = parseWithZod(userSchemas_1.authenticateUserSchema, req.body);
                const user = yield userService_1.default.verifyCredentials(payload.email, payload.password);
                res.json(user);
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
exports.default = userController;
