import express from "express";
import { Express }  from "express";
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`The API is running on the port: ${port}`)
});