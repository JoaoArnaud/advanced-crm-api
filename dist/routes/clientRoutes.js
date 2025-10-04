"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const clientController_1 = __importDefault(require("../controllers/clientController"));
const router = (0, express_1.Router)();
router.post("/companies/:companyId/clients", clientController_1.default.create);
router.get("/companies/:companyId/clients", clientController_1.default.list);
router.get("/companies/:companyId/clients/:clientId", clientController_1.default.getById);
router.put("/companies/:companyId/clients/:clientId", clientController_1.default.update);
router.patch("/companies/:companyId/clients/:clientId", clientController_1.default.update);
router.delete("/companies/:companyId/clients/:clientId", clientController_1.default.remove);
exports.default = router;
