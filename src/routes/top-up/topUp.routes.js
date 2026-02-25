import express from "express";
import validasiAuthrozationToken from "../../middleware/testing-api/valdasiAuthorization.js";
import useCheckCookieUser from "../../middleware/checkCookieUser.js";

const router = express.Router();

router.post(
  "/transaction/topup",
  useCheckCookieUser,
  validasiAuthrozationToken,
  topUpController,
);

export default router;
