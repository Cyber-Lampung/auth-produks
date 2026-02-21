import saveProdukService from "../../services/produks/produkSave.service.js";

export default async function produkUploadController(req, res, next) {
  try {
    const user = req.token;
    const produks = req.produk;

    const resServiceProduk = await saveProdukService(user, produks);

    if (resServiceProduk.status) {
      return res.status(201).json({
        status: true,
        message: "success upload produk",
        data: {
          user_information: resServiceProduk.data.searchInfoUser,
          produk_information: resServiceProduk.data.dataProduk,
        },
      });
    }
  } catch (error) {
    next(error);
  }
}
