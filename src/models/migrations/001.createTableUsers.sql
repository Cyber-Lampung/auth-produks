create table users (
    user_id varchar(100) not null,
    email varchar(50) not null PRIMARY KEY,
    username varchar(50) not null,
    password varchar(100) not null,
    role varchar(10) not null default 'user',
    created datetime
)