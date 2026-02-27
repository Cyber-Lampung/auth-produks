import konfirmasiPembayaranService from "../../services/transactions/konfirmasiPembayaran.service.js";

export default async function konfirmasiPembayaranController(req, res, next) {
  try {
    const { type_payment, total_pembayaran } = req.body;
    const user_id = req.user_id;

    const resService = await konfirmasiPembayaranService(
      user_id,
      type_payment,
      total_pembayaran,
    );

    if (resService.status) {
      return res
        .status(200)
        .json({ status: true, message: resService.message });
    } else {
      return res
        .status(400)
        .json({ status: false, message: resService.message });
    }
  } catch (error) {
    next(error);
  }
}
