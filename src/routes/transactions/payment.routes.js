import express from "express";
import validasiAuthrozationToken from "../../middleware/testing-api/valdasiAuthorization.js";
import useCheckCookieUser from "../../middleware/checkCookieUser.js";
import topUpController from "../../controllers/transactions/topup/topUp.controller.js";
import paymentFromDana from "../../controllers/transactions/dana.controller.js";
import konfirmasiPembayaranController from "../../controllers/transactions/komfirmasiPembayaran.controller.js";

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

router.post(
  "/transaction/konfirmasi-pembayaran",
  useCheckCookieUser,
  validasiAuthrozationToken,
  konfirmasiPembayaranController,
);

export default router;
