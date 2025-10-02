"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const companyController_1 = __importDefault(require("../controllers/companyController"));
const router = (0, express_1.Router)();
router.post("/companies", companyController_1.default.create);
router.get("/companies", companyController_1.default.list);
router.get("/companies/:id", companyController_1.default.getById);
router.put("/companies/:id", companyController_1.default.update);
router.patch("/companies/:id", companyController_1.default.update);
router.delete("/companies/:id", companyController_1.default.remove);
exports.default = router;
