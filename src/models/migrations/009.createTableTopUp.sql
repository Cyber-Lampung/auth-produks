create table riwayat_topup_saldo (
  user_id varchar(100) primary key,
  total_topup bigint,
  last_topup datetime,
  key_topup varchar(100)
)