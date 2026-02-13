import express from "express";
import cors from "cors";
import { CORS_ORIGIN } from "./utils/dotenv.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

import healthCheckRouter from "./routes/healthcheck.routes.js";
import userRouter from "./routes/user.routes.js";

app.use("/api/healthcheck", healthCheckRouter);
app.use("/api/users", userRouter);

export { app };
