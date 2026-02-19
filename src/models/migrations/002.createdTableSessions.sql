create table sessions (
    session_id varchar(100) not null primary key,
    user_id varchar(100) not null,
    refreshToken varchar(100) not null,
    created datetime not null,
    expiress datetime not null 
)