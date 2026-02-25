import {
  userInformationModel,
  searchProduksModel,
} from "../../models/repo/checkout/checkout.repo.js";

export default async function checkoutService(
  user_id,
  type_payment,
  alamat,
  voucher,
  checkout_information,
) {
  // validasi
  if (!type_payment || !alamat || !checkout_information) {
    return { status: false, message: "invalid checkout, values is not empety" };
  }

  // check checkout_information produks_id

  const produks = checkout_information.map((items) => {
    return { produksId: items.produks_id, qyt: items.qyt };
  });

  // parealler query
  const [checkUser, searchProduks] = await Promise.all([
    userInformationModel(user_id),
    searchProduksModel(produks[0].produksId),
  ]);

  // total kan pembelanjaan
  const total = searchProduks.data.price * produks[0].qyt;

  return {
    status: true,
    message: "succes checkout",
    information_checkout: { user: checkUser.data, checkout: { total: total } },
  };
}
