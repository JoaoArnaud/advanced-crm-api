import express from "express";
import { Express }  from "express";

const app: Express = express();
const port: number = 3000;

app.listen(port, () => {
    console.log(`A API subiu na porta ${port}`)
});