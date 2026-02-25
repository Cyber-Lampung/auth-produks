import express from "express";
import validasiMiddlewareCheckout from "../../middleware/validasiTokenCheckout.js";
import validasiAuthrozationToken from "../../middleware/testing-api/valdasiAuthorization.js";
import checkoutController from "../../controllers/checkout/checkout.controller.js";

const router = express.Router();

router.post(
  "/client/checkouts",
  validasiAuthrozationToken,
  validasiMiddlewareCheckout,
  checkoutController,
);

export default router;
