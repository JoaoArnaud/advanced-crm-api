"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const leadController_1 = __importDefault(require("../controllers/leadController"));
const router = (0, express_1.Router)();
router.post("/companies/:companyId/leads", leadController_1.default.create);
router.get("/companies/:companyId/leads", leadController_1.default.list);
router.get("/companies/:companyId/leads/:leadId", leadController_1.default.getById);
router.put("/companies/:companyId/leads/:leadId", leadController_1.default.update);
router.patch("/companies/:companyId/leads/:leadId", leadController_1.default.update);
router.delete("/companies/:companyId/leads/:leadId", leadController_1.default.remove);
exports.default = router;
