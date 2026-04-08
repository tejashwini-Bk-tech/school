import express from "express";
import cors from "cors";
import { notFoundHandler, errorHandler } from "./middleware/errorMiddleware.js";
import schoolRoutes from "./routes/schoolRoutes.js";
import authRoutes from "./routes/authroutes.js";

const app = express();

app.set("trust proxy", 1);
app.disable("x-powered-by");

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  next();
});

app.get("/health", (_req, res) => {
  res.json({ success: true, status: "ok", uptime: process.uptime() });
});

app.use("/", schoolRoutes);
app.use("/api/v1/auth", authRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
