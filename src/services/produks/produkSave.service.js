import {
  getUserInfo,
  saveProduk,
} from "../../models/repo/produks/produksUploads.repo.js";
import generateUUID from "../../utils/generateUUID.js";

export default async function saveProdukService(token, produk) {
  const produk_id = await generateUUID();
  // normalisasikan data produk

  const dataProduk = {
    produk_id: produk_id,
    produk_name: produk.produk_name,
    price: produk.price,
    stock: produk.stock,
    more_information: {
      desc: produk.more_information.desc,
      category_produks: produk.more_information.category,
      produk_image: produk.more_information.image,
      image: produk.image,
    },
  };

  // search user by refreshToken
  const [searchInfoUser, resSaveProduk] = await Promise.all([
    getUserInfo(token),
    saveProduk(produk_id, produk),
  ]);

  if (searchInfoUser.status && resSaveProduk.status) {
    return { status: true, data: { searchInfoUser, dataProduk } };
  }
}
