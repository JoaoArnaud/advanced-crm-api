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
const argon2_1 = __importDefault(require("argon2"));
const prisma_1 = __importDefault(require("../db/prisma"));
const prisma_2 = require("../generated/prisma");
const hashPassword = (password) => argon2_1.default.hash(password, {
    type: argon2_1.default.argon2id,
    memoryCost: Math.pow(2, 16),
    timeCost: 3,
    parallelism: 1,
});
const userService = {
    createUser(_a) {
        return __awaiter(this, arguments, void 0, function* ({ name, email, password, companyId, role = prisma_2.Role.USER, }) {
            const hashedPassword = yield hashPassword(password);
            return prisma_1.default.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    role,
                    company: {
                        connect: { id: companyId },
                    },
                },
            });
        });
    },
    getUsers() {
        return prisma_1.default.user.findMany();
    },
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.user.findUnique({ where: { id } });
        });
    },
    updateUser(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { password, companyId } = data, rest = __rest(data, ["password", "companyId"]);
            const updateData = Object.assign({}, rest);
            if (password) {
                updateData.password = yield hashPassword(password);
            }
            if (companyId) {
                updateData.company = { connect: { id: companyId } };
            }
            return prisma_1.default.user.update({
                where: { id },
                data: updateData,
            });
        });
    },
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma_1.default.user.delete({ where: { id } });
        });
    },
};
exports.default = userService;
