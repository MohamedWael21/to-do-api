import session, { SessionOptions } from "express-session";
import { init } from "./server";
import morgan from "morgan";
import express from "express";
import authRoutes from "./routes/auth";
import taskRoutes from "./routes/tasks";
import globalErrorHandle from "./lib/globalErrorHandle";

const sessionOptions: SessionOptions = {
  secret: process.env.COOKIE_SECRET!,
  cookie: {
    maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days,
    sameSite: true,
  },
  resave: false,
  saveUninitialized: true,
};

(async function () {
  const app = await init();

  app.use(morgan("tiny"));
  app.use(express.json());
  app.use(session(sessionOptions));

  // register all routes
  app.use(authRoutes);
  app.use(taskRoutes);

  // global error handle
  app.use(globalErrorHandle);
})();

process.on("uncaughtException", (error) => {
  console.log(error);
  process.exit(1);
});

process.on("unhandledRejection", (error) => {
  console.log(error);
  process.exit(1);
});
