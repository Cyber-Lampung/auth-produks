import searchProduksEditService from "../../services/produks/searchProduksEdit.service.js";

export default async function searchProduksEditController(req, res, next) {
  try {
    const produks_id = req.params.produks_id;

    const resService = await searchProduksEditService(produks_id);

    if (resService.status) {
      return res.status(200).json({
        status: true,
        message: resService.message,
        data: resService.data,
      });
    } else {
      return res.status(404).json({
        status: false,
        message: resService.message,
      });
    }
  } catch (error) {
    next(error);
  }
}
