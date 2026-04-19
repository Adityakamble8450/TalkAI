import express from "express";
import cors from "cors";
import router from "./routes/auth.routes.js";
import cookieparser from 'cookie-parser'

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser())

app.use("/api/auth", router);



export default app;
