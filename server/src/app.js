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
import courseRouter from "./routes/course.routes.js";
import videoRouter from "./routes/video.routes.js";

app.use("/api/healthcheck", healthCheckRouter);
app.use("/api/users", userRouter);
app.use("/api/courses", courseRouter);
app.use("/api/videos", videoRouter);

export { app };
