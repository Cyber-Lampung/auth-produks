import express from "express";
import produkListController from "../../controllers/produks/produkList.controller.js";
import useCheckCookieUser from "../../middleware/checkCookieUser.js";
import validasiRoleUser from "../../middleware/validasiRole.js";

const router = express.Router();

router.get(
  "/produks/list",
  useCheckCookieUser,
  validasiRoleUser,
  produkListController,
);

export default router;
