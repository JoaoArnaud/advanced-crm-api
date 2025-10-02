import express, { Express } from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import companyRoutes from "./routes/companyRoutes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/api", userRoutes);
app.use("/api", companyRoutes);

app.listen(port, () => {
    console.log(`The API is running on the port: ${port}`);
});
