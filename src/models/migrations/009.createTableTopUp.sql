create table topup_saldo (
    user_id varchar(100) primary key,
  saldo bigint,
  last_topup datetime,
  key_topup varchar(100)
)