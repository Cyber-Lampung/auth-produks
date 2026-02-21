import db from "../../../config/db.config.js";

export async function getUserInfo(refreshToken) {
  const searchInfoUser = await db.query(
    "select u.user_id, u.email, u.username, u.role from users u join sessions s on u.user_id = s.user_id where s.refreshToken = ?",
    [refreshToken],
  );

  if (searchInfoUser) {
    return {
      status: true,
      message: "information users",
      data: searchInfoUser[0],
    };
  }
}

export async function saveProduk(produk_id, produk) {
  const [resQuery] = await db.query(
    "insert into produks (produk_id, produk_name, price, stock, more_information, upload_created) values (?, ?, ?, ?, ?, NOW())",
    [
      produk_id,
      produk.produk_name,
      produk.price,
      produk.stock,
      JSON.stringify(produk.more_information),
    ],
  );

  if (resQuery.affectedRows > 0) {
    return { status: true };
  } else {
    return { status: false };
  }
}
