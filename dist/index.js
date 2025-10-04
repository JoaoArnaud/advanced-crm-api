"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const companyRoutes_1 = __importDefault(require("./routes/companyRoutes"));
const leadRoutes_1 = __importDefault(require("./routes/leadRoutes"));
const clientRoutes_1 = __importDefault(require("./routes/clientRoutes"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = __importDefault(require("./docs/swagger"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use("/api", userRoutes_1.default);
app.use("/api", companyRoutes_1.default);
app.use("/api", leadRoutes_1.default);
app.use("/api", clientRoutes_1.default);
app.use("/api/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default, { explorer: true }));
app.get("/api/docs.json", (_req, res) => {
    res.json(swagger_1.default);
});
app.listen(port, () => {
    console.log(`The API is running on the port: ${port}`);
});
