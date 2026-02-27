create table saldo (
    user_id varchar(100) primary key,
    total_saldo bigint DEFAULT 0,
    last_total_topup bigint,
    last_topup datetime
)