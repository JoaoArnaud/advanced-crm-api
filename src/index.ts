import express from "express";
import { Express }  from "express";

const app: Express = express();
const port: number = 3000;

app.listen(port, () => {
    console.log(`The API is running on the port: ${port}`)
});