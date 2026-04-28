import express from "express";
import cors from "cors";
import router from "./routes/auth.routes.js";
import chatRouter from "./routes/chat.routes.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistPath = path.resolve(__dirname, "../../Frontend/dist");
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const isProduction = process.env.NODE_ENV === "production";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: clientOrigin,
    credentials: true,
  })
);
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.status(200).json({ success: true, message: "Server is running" });
});

app.use("/api/auth", router);
app.use("/api/chats", chatRouter);

if (isProduction) {
  app.use(express.static(frontendDistPath));

  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

export default app;
