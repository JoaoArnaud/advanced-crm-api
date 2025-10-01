import express, { Express } from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/api", userRoutes);

app.listen(port, () => {
    console.log(`The API is running on the port: ${port}`);
});
