import deleteProdukService from "../../services/produks/deletProduk.service.js";

export default async function deleteProdukController(req, res, next) {
  try {
    const produk_id_params = req.params.produks_id;

    console.time("deleteProdukService");
    const resService = await deleteProdukService(produk_id_params);
    console.timeEnd("deleteProdukService");

    if (resService.status) {
      return res.status(200).json({
        status: true,
        message: resService.message,
        produk_id: produk_id_params,
      });
    } else {
      return res
        .status(404)
        .json({ status: false, message: resService.message });
    }
  } catch (error) {
    next(error);
  }
}
