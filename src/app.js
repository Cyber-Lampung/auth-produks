import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import * as dotenv from "dotenv";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("trust proxy", true);
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);
app.use(cookieParser());
app.use(morgan("dev"));

//
app.use(express.static("public"));
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// check healt
app.get("/health", (req, res, next) => {
  return res.status(200).json({ status: true, message: "server is alive" });
});

import userRoute from "./routes/auth/users.routes.js";
import produksRoute from "./routes/produk/produk.routes.js";
import testingAPI from "./routes/testing-api/testing.routes.js";
import checkoutRoute from "./routes/checkout/checkout.routes.js";
import transaction from "./routes/top-up/topUp.routes.js";

// import routes
app.use("/api", userRoute);
app.use("/api", produksRoute);
app.use("/api", checkoutRoute);
app.use("/api", testingAPI);

app.use((req, res, next) => {
  return res.status(404).json({ status: false, message: "invalid path" });
});

app.use((err, req, res, next) => {
  // dev local
  if (process.env.NODE_ENV === "dev") {
    return res.status(err.status || 500).json({
      status: false,
      message: "error",
      error: err.message,
      err_stack: err.stack,
    });
  }

  // production
  return res.status(err.status || 500).json({
    status: false,
    message: "error",
    error: err.message,
  });
});

export default app;
