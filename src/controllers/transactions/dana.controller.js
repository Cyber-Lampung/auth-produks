export default async function paymentFromDana(req, res, next) {
  try {
    // get saldo and inforation user
    const user_id = req.user_id;

    const { saldo_payment, type } = req.body;

    const resService = await paymentFromDanaSevice(
      user_id,
      saldo_payment,
      type,
    );
  } catch (error) {
    next(error);
  }
}
