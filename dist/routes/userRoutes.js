"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = __importDefault(require("../controllers/userController"));
const router = (0, express_1.Router)();
router.post("/users", userController_1.default.create);
router.get("/users", userController_1.default.list);
router.get("/users/:id", userController_1.default.getById);
router.put("/users/:id", userController_1.default.update);
router.patch("/users/:id", userController_1.default.update);
router.delete("/users/:id", userController_1.default.remove);
router.post("/users/login", userController_1.default.authenticate);
exports.default = router;
