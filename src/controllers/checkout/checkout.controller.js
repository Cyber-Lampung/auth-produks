import checkoutService from "../../services/checkout/checkout.service.js";

export default async function checkoutController(req, res, next) {
  try {
    // get informatio users
    const user_id = req.user_id;

    const { status, type_payment, alamat, voucher, checkout_information } =
      req.body;

    const resService = await checkoutService(
      user_id,
      type_payment,
      checkout_information,
    );

    if (!resService) {
      return res
        .status(400)
        .json({ status: false, message: "checkout produks error" });
    }

    if (resService.status) {
      return res.status(200).json({
        status: status,
        message: resService.message,
        result: {
          status: "pending",
          message_type: "success checkout",
          data_user: {
            informasi_pengguna: resService.information_checkout.user,
            alamat: alamat,
          },
          checkout: {
            type_payment: type_payment,
            checkout_information: resService.information_checkout.checkout,
            checkout_at: new Date().toISOString(),
          },
        },
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
