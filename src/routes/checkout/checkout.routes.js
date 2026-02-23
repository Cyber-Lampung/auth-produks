import express from "express";
import validasiMiddlewareCheckout from "../../middleware/validasiTokenCheckout.js";

const router = express.Router();

router.post("/client/checkouts", validasiMiddlewareCheckout);
