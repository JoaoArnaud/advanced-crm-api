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
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use("/api", userRoutes_1.default);
app.use("/api", companyRoutes_1.default);
app.use("/api", leadRoutes_1.default);
app.use("/api", clientRoutes_1.default);
app.listen(port, () => {
    console.log(`The API is running on the port: ${port}`);
});
