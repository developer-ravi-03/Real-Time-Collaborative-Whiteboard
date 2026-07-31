import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import env from "./config/env.js";
import { clerkMiddleware } from "./config/clerk.js";

import authRoutes from "./modules/auth/auth.routes.js";
import routes from "./routes/index.js";

import notFoundHandler from "./middleware/notFound.middleware.js";
import errorHandler from "./middleware/error.middleware.js";

const app = express();

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(clerkMiddleware());

/* ===========================
   RAW BODY ONLY FOR WEBHOOK
=========================== */

app.use(
  "/api/v1/auth/webhook",
  express.raw({
    type: "application/json",
  }),
);

/* ===========================
   JSON BODY FOR EVERYTHING ELSE
=========================== */

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

/* ===========================
   ROUTES
=========================== */

app.use(`/api/${env.API_VERSION}/auth`, authRoutes);

app.use(`/api/${env.API_VERSION}`, routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
