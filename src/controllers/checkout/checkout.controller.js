import checkoutService from "../../services/checkout/checkout.service.js";

export default async function checkoutController(req, res, next) {
  try {
    // get informatio users
    const user_id = req.user_id;

    const { status, type_payment, alamat, voucher, checkout_information } =
      req.body;

    const resService = await checkoutService(
      user_id,
      status,
      type_payment,
      alamat,
      voucher,
      checkout_information,
    );

    if (resService.status) {
      return res.status(200).json({
        status: true,
        message: resService.message,
        result: {
          status: "pending",
          message_type: "prosess checkout",
          checkout_id: 100101010,
          data_user: resService.information_checkout.user,
          type_payment: type_payment,
          checkout_information: resService.information_checkout.checkout,
          checkout_at: "25-02-2025, 08.45",
        },
      });
    }
  } catch (error) {
    next(error);
  }
}
