import express from "express";
import produkListController from "../../controllers/produks/produkList.controller.js";
import useCheckCookieUser from "../../middleware/checkCookieUser.js";
import validasiRoleUser from "../../middleware/validasiRole.js";
import produkUploadController from "../../controllers/produks/produkUpload.controller.js";
import middlewareCheckRole from "../../services/middlewareCheckRole.service.js";
import checkInputanProduk from "../../middleware/produkCheckInputan.js";
import upload from "../../config/multer.config.js";

const router = express.Router();

// get all produks
router.get(
  "/produks/list",
  useCheckCookieUser,
  validasiRoleUser,
  produkListController,
);

// produk uploads
router.post(
  "/produks/uploads",
  useCheckCookieUser,
  checkInputanProduk,
  upload.array("images", 5),
  produkUploadController,
);

export default router;
