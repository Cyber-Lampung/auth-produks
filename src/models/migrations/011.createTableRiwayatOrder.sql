create table riwayat_store (
    riwayat_id varchar(100) PRIMARY KEY,
    user_id varchar(100),
    produk_store json,
    price_total bigint,
    time_store datetime DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(user_id)
)