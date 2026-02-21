import express from "express";
import produkListController from "../../controllers/produks/produkList.controller.js";
import useCheckCookieUser from "../../middleware/checkCookieUser.js";
import validasiRoleUser from "../../middleware/validasiRole.js";
import produkUploadController from "../../controllers/produks/produkUpload.controller.js";
import middlewareCheckRole from "../../services/middlewareCheckRole.service.js";
import checkInputanProduk from "../../middleware/produkCheckInputan.js";

const router = express.Router();

router.get(
  "/produks/list",
  useCheckCookieUser,
  validasiRoleUser,
  produkListController,
);

router.post(
  "/produks/uploads",
  useCheckCookieUser,
  checkInputanProduk,
  produkUploadController,
);

export default router;
