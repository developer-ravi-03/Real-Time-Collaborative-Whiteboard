import dotenv from "dotenv";
import { cleanEnv, str, port } from "envalid";

dotenv.config();

const env = cleanEnv(process.env, {
  NODE_ENV: str({
    default: "development",
    choices: ["development", "production", "test"],
  }),

  PORT: port({
    default: 5000,
  }),

  APP_NAME: str({
    default: "SyncBoard",
  }),

  API_VERSION: str({
    default: "v1",
  }),

  DATABASE_URL: str(),

  FRONTEND_URL: str(),

  SOCKET_CORS_ORIGIN: str(),

  CLERK_SECRET_KEY: str({
    default: "",
  }),

  CLERK_PUBLISHABLE_KEY: str({
    default: "",
  }),

  CLERK_WEBHOOK_SECRET: str({
    default: "",
  }),

  CLOUDINARY_CLOUD_NAME: str({
    default: "",
  }),

  CLOUDINARY_API_KEY: str({
    default: "",
  }),

  CLOUDINARY_API_SECRET: str({
    default: "",
  }),

  TURN_SERVER_URL: str({
    default: "",
  }),

  TURN_SERVER_USERNAME: str({
    default: "",
  }),

  TURN_SERVER_PASSWORD: str({
    default: "",
  }),
});

export default env;
