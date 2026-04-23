import express from "express";
import cors from "cors";
import router from "./routes/auth.routes.js";
import chatRouter from "./routes/chat.routes.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(morgan("dev"));

app.use("/api/auth", router);
app.use("/api/chats", chatRouter);



export default app;
