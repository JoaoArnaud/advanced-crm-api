import express from "express";
import { Express }  from "express";

const app: Express = express();
const port: number = 3000;

app.listen(port, () => {
    console.log(`The API is running on the port: ${port}`)
});

//DATABASE_URL="postgresql://postgres:1234@localhost:5432/clinica?sslmode=disable"
//PORT=3333