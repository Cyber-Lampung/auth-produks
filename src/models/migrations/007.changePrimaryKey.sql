alter table sessions add index idx_refreshToken (refreshToken)

ALTER TABLE users add index idx_user (user_id)