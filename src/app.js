import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import * as dotenv from "dotenv";
import morgan from "morgan";
dotenv.config();

const app = express();

app.set("trust proxy", true);
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(morgan());

app.use(express.static("public"));

// check healt
app.get("/health", (req, res, next) => {
  return res.status(200).json({ status: true, message: "server is alive" });
});

import userRoute from "./routes/auth/users.routes.js";

// import routes
app.use("/api", userRoute);

app.use((req, res, next) => {
  return res.status(404).json({ status: false, message: "invalid path" });
});

app.use((err, req, res, next) => {
  return res
    .status(err.status || 500)
    .json({ status: false, message: "error", error: err.message });
});

export default app;
