import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import env from "./config/env.js";

import routes from "./routes/index.js";

import notFoundHandler from "./middleware/notFound.middleware.js";
import errorHandler from "./middleware/error.middleware.js";

const app = express();

/* -------------------------------------------------------------------------- */
/*                               Global Middlewares                           */
/* -------------------------------------------------------------------------- */

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(helmet());

app.use(morgan("dev"));

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(cookieParser());

/* -------------------------------------------------------------------------- */
/*                                  API Routes                                */
/* -------------------------------------------------------------------------- */

app.use(`/api/${env.API_VERSION}`, routes);

/* -------------------------------------------------------------------------- */
/*                              404 Not Found                                 */
/* -------------------------------------------------------------------------- */

app.use(notFoundHandler);

/* -------------------------------------------------------------------------- */
/*                           Global Error Handler                             */
/* -------------------------------------------------------------------------- */

app.use(errorHandler);

export default app;
