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
import youtubeRouter from "./routes/youtube.routes.js";
import questionRouter from "./routes/question.routes.js";
import answerRouter from "./routes/answer.routes.js";
import commentRouter from "./routes/comment.routes.js";
import bookmarkRouter from "./routes/bookmark.routes.js";
import notificationRouter from "./routes/notification.routes.js";

app.use("/api/healthcheck", healthCheckRouter);
app.use("/api/users", userRouter);
app.use("/api/courses", courseRouter);
app.use("/api/videos", videoRouter);
app.use("/api/youtube", youtubeRouter);
app.use("/api/questions", questionRouter);
app.use("/api/answers", answerRouter);
app.use("/api/comments", commentRouter);
app.use("/api/bookmarks", bookmarkRouter);
app.use("/api/notifications", notificationRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors: err.errors || [],
  });
});

export { app };
