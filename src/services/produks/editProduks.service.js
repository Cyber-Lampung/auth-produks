import editProduksModel from "../../models/repo/produks/editProduks.repo.js";

export default async function editProduksService(
  produks_id_params,
  produk_name,
  price,
  stock,
) {
  if (!produks_id_params) {
    return { status: false, message: "produks_id is not empety values" };
  }

  const fields = [];
  const values = [];

  if (produk_name) {
    fields.push("produk_name = ?");
    values.push(produk_name);
  }

  if (price) {
    fields.push("price = ?");
    values.push(price);
  }

  if (stock) {
    fields.push("stock = ?");
    values.push(stock);
  }

  values.push(produks_id_params);

  const [updateProduk] = await Promise.all([editProduksModel(fields, values)]);

  if (updateProduk.status) {
    return { status: true, message: "succes update produk", update_id: 1 };
  } else {
    return { status: false, message: "invalid update produks" };
  }
}
