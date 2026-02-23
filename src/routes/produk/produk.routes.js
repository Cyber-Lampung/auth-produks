import express from "express";
import produkListController from "../../controllers/produks/produkList.controller.js";
import useCheckCookieUser from "../../middleware/checkCookieUser.js";
import validasiRoleUser from "../../middleware/validasiRole.js";
import produkUploadController from "../../controllers/produks/produkUpload.controller.js";
// import middlewareCheckRole from "../../services/middlewareCheckRole.service.js";
import checkInputanProduk from "../../middleware/produkCheckInputan.js";
import upload from "../../config/multer.config.js";
import deleteProdukController from "../../controllers/produks/deleteProduk.controller.js";
import editProduksController from "../../controllers/produks/editProduks.controller.js";
import searchProduksEditController from "../../controllers/produks/searchProduksEdit.controller.js";

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
  validasiRoleUser,
  upload.single("images", 5),
  checkInputanProduk,
  produkUploadController,
);

// search produks for edit => public endpoint
router.get(
  "/produks/searchProduks/:produks_id",
  // useCheckCookieUser,
  // validasiRoleUser,
  searchProduksEditController,
);

// edit produks
router.patch(
  "/produks/edit/:produks_id",
  useCheckCookieUser,
  validasiRoleUser,
  editProduksController,
);

// delete produk
router.delete(
  "/produks/delete/:produks_id",
  useCheckCookieUser,
  validasiRoleUser,
  deleteProdukController,
);

export default router;
