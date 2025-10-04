import express, { Express } from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import companyRoutes from "./routes/companyRoutes";
import leadRoutes from "./routes/leadRoutes";
import clientRoutes from "./routes/clientRoutes";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./docs/swagger";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/api", userRoutes);
app.use("/api", companyRoutes);
app.use("/api", leadRoutes);
app.use("/api", clientRoutes);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
app.get("/api/docs.json", (_req, res) => {
    res.json(swaggerSpec);
});

app.listen(port, () => {
    console.log(`The API is running on the port: ${port}`);
});
