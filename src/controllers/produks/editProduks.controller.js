import editProduksService from "../../services/produks/editProduks.service.js";

export default async function editProduksController(req, res, next) {
  try {
    const produks_id_params = req.params.produks_id;
    const { produk_name, price, stock } = req.body;

    const resService = await editProduksService(
      produks_id_params,
      produk_name,
      price,
      stock,
    );

    if (resService.status) {
      return res.status(200).json({
        status: true,
        message: resService.message,
        id: resService.update_id,
      });
    } else {
      return res
        .status(400)
        .json({ status: false, message: resService.message });
    }
  } catch (error) {
    next(error);
  }
}
