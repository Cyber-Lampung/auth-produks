import validationInputanProdukService from "../services/produks/validationsInputan.service.js";

export default async function checkInputanProduk(req, res, next) {
  // check inputan user validation
  const { produk_name, price, stock, size, desc, category_produks } = req.body;
  const images = req.files;

  const resServiceValdation = await validationInputanProdukService(
    produk_name,
    price,
    stock,
    size,
    desc,
    category_produks,
  );

  if (!resServiceValdation) {
    return res.status(400).json({
      status: false,
      message: "invalid upload, fields produk is empety",
    });
  }

  req.produk = {
    produk_name,
    price,
    stock,
    size,
    desc,
    category_produks,
    images,
  };
  next();
}
