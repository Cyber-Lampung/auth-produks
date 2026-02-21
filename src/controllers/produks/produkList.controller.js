import getProdukListService from "../../services/produks/getProdukList.service.js";

export default async function produkListController(req, res, next) {
  try {
    console.time("getProdukListService");
    const resService = await getProdukListService();
    console.timeEnd("getProdukListService");

    if (resService.status) {
      return res.status(200).json({
        status: true,
        message: "success produk list",
        produk_list: resService.produk_list,
      });
    }
  } catch (error) {
    next(error);
  }
}
