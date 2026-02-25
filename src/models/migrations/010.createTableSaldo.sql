create table saldo (
    user_id varchar(100) primary key,
    saldo bigint,
    last_total_topup bigint,
    last_topup datetime
)