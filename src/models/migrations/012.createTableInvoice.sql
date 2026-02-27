create table invoice (
    invoice_id varchar(100) PRIMARY KEY,
    user_id varchar(100),
    status_invoice text,
    created datetime,
    expires datetime DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(user_id)
)