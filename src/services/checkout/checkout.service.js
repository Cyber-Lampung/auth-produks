import {
  userInformationModel,
  searchProduksModel,
  updateStockProdukModel,
  saveRiwayatCheckout,
  saveInvoiceModel,
  searchInvoiceModel,
} from "../../models/repo/checkout/checkout.repo.js";
import generateUUID from "../../utils/generateUUID.js";
import changeFormatRp from "../../utils/changeFormatRp.js";
import db from "../../config/db.config.js";

export default async function checkoutService(
  user_id,
  type_payment,
  checkout_information,
) {
  const conn = await db.getConnection();
  try {
    conn.beginTransaction();

    // validasi apakah user ada invoice yang pending

    const searchInvoice = await searchInvoiceModel(user_id);

    if (searchInvoice) {
      return {
        status: false,
        message: "masih ada invoice produks status pending",
      };
    }

    // validate input
    if (
      !type_payment ||
      !Array.isArray(checkout_information) ||
      checkout_information.length === 0 ||
      checkout_information.some((item) => item.qyt < 1 || !item.produks_id)
    ) {
      return {
        status: false,
        message: "invalid checkout, values are missing or empty",
      };
    }

    // identity checkout
    const checkout_id = await generateUUID();
    const invoce_id = await generateUUID();

    const arr_produk_id = [];
    const qyt = [];
    let status_invoice = "";

    // check checkout_information produks_id
    // build arrays of ids and quantities
    for (const item of checkout_information) {
      arr_produk_id.push(`${item.produks_id}`);
      qyt.push(item.qyt);
    }

    const searchProduks = await searchProduksModel(arr_produk_id);

    // total
    let total = 0;

    // Calculate total
    for (let i = 0; i < checkout_information.length; i++) {
      const item = checkout_information[i];
      total += searchProduks[i].price * item.qyt;
    }

    if (type_payment === "spaylater" || type_payment === "dana") {
      status_invoice = "pending";
    }

    // parallel queries
    const [checkUser, updateStockProduk, riwayatCheckout, saveInvoice] =
      await Promise.all([
        userInformationModel(user_id),
        updateStockProdukModel(checkout_information),
        saveRiwayatCheckout(checkout_id, user_id, checkout_information, total),
        saveInvoiceModel(invoce_id, user_id, status_invoice),
      ]);

    if (!searchProduks || searchProduks.length === 0) {
      return { status: false, message: "produks not found" };
    }

    const checkStock = searchProduks.map((stock, index) => {
      const qytUser = qyt[index];
      // if stock is strictly less than requested quantity, it's insufficient
      return stock.stock < qytUser;
    });

    const validasiStock = checkStock.includes(true);

    if (validasiStock) {
      return { status: false, message: "stock produk tidak mencukupi" };
    }

    // validasi stock

    // searchProduks.data.map((price) => {
    //   harga.push(price.price);
    // });

    if (updateStockProduk && riwayatCheckout && saveInvoice) {
      await conn.commit();
      return {
        status: true,
        message: "success checkout",
        information_checkout: {
          user: checkUser.data,
          checkout: {
            checkout_id,
            total,
          },
        },
      };
    } else {
      await conn.rollback();
      return {
        status: false,
        message: "invalid checkout",
        information_checkout: {
          user: checkUser.data,
          checkout: {
            checkout_id,
            total,
          },
        },
      };
    }
  } catch (error) {
    await conn.rollback();
    // bubble error or return standardized response
    console.error("checkoutService error", error);
    return { status: false, message: "internal server error", error };
  } finally {
    conn.release();
  }
}
