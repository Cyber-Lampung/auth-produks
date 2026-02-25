import topUpSaldoService from "../../../services/transactions/topUp/topUpSaldo.service.js";

export default async function topUpController(req, res, next) {
  try {
    const user_id = req.user_id;

    const { saldo } = req.body;

    const resService = await topUpSaldoService(user_id, saldo);

    if (resService.status) {
      return res
        .status(201)
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
