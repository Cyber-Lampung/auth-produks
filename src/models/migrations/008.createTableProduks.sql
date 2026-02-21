create table produks (
    produk_id varchar(100) primary key,
    produk_name text,
    price bigint,
    stock int,
    more_information json,
    upload_created datetime
)