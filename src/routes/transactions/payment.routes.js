import express from "express";
import validasiAuthrozationToken from "../../middleware/testing-api/valdasiAuthorization.js";
import useCheckCookieUser from "../../middleware/checkCookieUser.js";
import topUpController from "../../controllers/transactions/topup/topUp.controller.js";
import paymentFromDana from "../../controllers/transactions/dana.controller.js";

const router = express.Router();

// payment via dana => contoh
router.post(
  "/transaction/dana",
  useCheckCookieUser,
  validasiAuthrozationToken,
  paymentFromDana,
);

router.post(
  "/transaction/topup",
  useCheckCookieUser,
  validasiAuthrozationToken,
  topUpController,
);

export default router;
