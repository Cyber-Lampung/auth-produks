# Database Schema Documentation

## 📊 Database Overview

**Database Name**: backend_porto  
**Database Type**: MySQL 8.0 / MariaDB 10.5+  
**Character Set**: UTF8MB4  
**Collation**: utf8mb4_unicode_ci

---

## 📋 Table Structure

### 1. `users` Table

**Purpose**: Store user account information

**Creation**: Migration 001

**SQL**:

```sql
CREATE TABLE users (
    user_id VARCHAR(100) NOT NULL,
    email VARCHAR(50) NOT NULL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(10) NOT NULL DEFAULT 'user',
    created DATETIME
);
```

**Columns**:

| Column     | Type     | Size | Key | Default | Description                 |
| ---------- | -------- | ---- | --- | ------- | --------------------------- |
| `user_id`  | VARCHAR  | 100  |     |         | Unique identifier (UUID v4) |
| `email`    | VARCHAR  | 50   | PK  |         | Email address (unique)      |
| `username` | VARCHAR  | 50   |     |         | Display name                |
| `password` | VARCHAR  | 100  |     |         | Hashed password (bcrypt)    |
| `role`     | VARCHAR  | 10   |     | 'user'  | User role ('user', 'admin') |
| `created`  | DATETIME |      |     |         | Account creation timestamp  |

**Indexes**:

- PRIMARY KEY: `email`
- INDEX: `user_id` (untuk join dengan tables lain)

**Constraints**:

- Email bersifat unique (PRIMARY KEY)
- Role hanya bisa 'user' atau 'admin'

**Example Data**:

```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "john@example.com",
  "username": "johndoe",
  "password": "$2b$10$...(hashed)",
  "role": "user",
  "created": "2026-02-27 10:30:00"
}
```

**Notes**:

- Password di-hash dengan bcrypt salt rounds 10
- user_id di-generate menggunakan uuid library
- Email adalah unique identifier untuk sistem

---

### 2. `sessions` Table

**Purpose**: Store user session and JWT token information

**Creation**: Migration 002

**SQL**:

```sql
CREATE TABLE sessions (
    session_id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(100),
    token VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(user_id)
);
```

**Columns**:

| Column       | Type     | Size | Key | Default           | Description                |
| ------------ | -------- | ---- | --- | ----------------- | -------------------------- |
| `session_id` | VARCHAR  | 100  | PK  |                   | Session UUID               |
| `user_id`    | VARCHAR  | 100  | FK  |                   | Reference ke users.user_id |
| `token`      | VARCHAR  | 500  |     |                   | JWT token                  |
| `is_active`  | BOOLEAN  |      |     | TRUE              | Is session active          |
| `created`    | DATETIME |      |     | CURRENT_TIMESTAMP | Session creation time      |

**Indexes**:

- PRIMARY KEY: `session_id`
- FOREIGN KEY: `user_id` → users.user_id
- INDEX: `user_id` (untuk lookup by user)

**Example Data**:

```json
{
  "session_id": "session_123456",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "is_active": true,
  "created": "2026-02-27 10:30:00"
}
```

---

### 3. `produks` Table

**Purpose**: Store product information

**Creation**: Migration 008

**SQL**:

```sql
CREATE TABLE produks (
    produk_id VARCHAR(100) PRIMARY KEY,
    produk_name TEXT,
    price BIGINT,
    stock INT,
    more_information JSON,
    upload_created DATETIME
);
```

**Columns**:

| Column             | Type     | Size | Key | Default | Description        |
| ------------------ | -------- | ---- | --- | ------- | ------------------ |
| `produk_id`        | VARCHAR  | 100  | PK  |         | Product UUID       |
| `produk_name`      | TEXT     |      |     |         | Product name       |
| `price`            | BIGINT   |      |     |         | Price in IDR       |
| `stock`            | INT      |      |     |         | Available stock    |
| `more_information` | JSON     |      |     |         | Additional details |
| `upload_created`   | DATETIME |      |     |         | Creation timestamp |

**Indexes**:

- PRIMARY KEY: `produk_id`
- INDEX: `produk_name` (FULLTEXT untuk search)

**JSON Structure** (more_information):

```json
{
  "description": "Product description",
  "category": "Electronics",
  "specifications": {
    "processor": "Intel i7",
    "ram": "16GB",
    "storage": "512GB SSD"
  },
  "image_url": "/uploads/prod_123456.jpg",
  "rating": 4.5,
  "reviews_count": 128
}
```

**Example Data**:

```json
{
  "produk_id": "prod_550e8400e29b41d4",
  "produk_name": "Laptop Dell XPS 13",
  "price": 15000000,
  "stock": 5,
  "more_information": {
    "processor": "Intel i7-1185G7",
    "ram": "16GB",
    "storage": "512GB SSD",
    "description": "Premium laptop for professionals"
  },
  "upload_created": "2026-02-27 10:00:00"
}
```

---

### 4. `topup` Table

**Purpose**: Track user top-up transactions

**Creation**: Migration 009

**SQL**:

```sql
CREATE TABLE topup (
    topup_id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(100),
    amount BIGINT,
    status VARCHAR(20),
    created DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(user_id)
);
```

**Columns**:

| Column     | Type     | Size | Key | Default           | Description                      |
| ---------- | -------- | ---- | --- | ----------------- | -------------------------------- |
| `topup_id` | VARCHAR  | 100  | PK  |                   | Top-up UUID                      |
| `user_id`  | VARCHAR  | 100  | FK  |                   | Reference ke users.user_id       |
| `amount`   | BIGINT   |      |     |                   | Amount in IDR                    |
| `status`   | VARCHAR  | 20   |     |                   | 'pending', 'completed', 'failed' |
| `created`  | DATETIME |      |     | CURRENT_TIMESTAMP | Creation timestamp               |

**Status Values**:

- `pending`: Menunggu konfirmasi
- `completed`: Pembayaran selesai
- `failed`: Pembayaran gagal
- `cancelled`: Dibatalkan

**Example Data**:

```json
{
  "topup_id": "topup_550e8400",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "amount": 500000,
  "status": "completed",
  "created": "2026-02-27 11:00:00"
}
```

---

### 5. `saldo` Table

**Purpose**: Store user balance/wallet information

**Creation**: Migration 010

**SQL**:

```sql
CREATE TABLE saldo (
    saldo_id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(100) UNIQUE,
    balance BIGINT DEFAULT 0,
    FOREIGN KEY(user_id) REFERENCES users(user_id)
);
```

**Columns**:

| Column     | Type    | Size | Key        | Default | Description                |
| ---------- | ------- | ---- | ---------- | ------- | -------------------------- |
| `saldo_id` | VARCHAR | 100  | PK         |         | Balance record UUID        |
| `user_id`  | VARCHAR | 100  | FK, UNIQUE |         | Reference ke users.user_id |
| `balance`  | BIGINT  |      |            | 0       | Current balance in IDR     |

**Indexes**:

- PRIMARY KEY: `saldo_id`
- UNIQUE: `user_id` (satu saldo per user)
- FOREIGN KEY: `user_id` → users.user_id

**Example Data**:

```json
{
  "saldo_id": "saldo_550e8400",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "balance": 1500000
}
```

---

### 6. `riwayat_store` Table

**Purpose**: Track order history / purchase records

**Creation**: Migration 011

**SQL**:

```sql
CREATE TABLE riwayat_store (
    riwayat_id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(100),
    produk_store JSON,
    price_total BIGINT,
    time_store DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(user_id)
);
```

**Columns**:

| Column         | Type     | Size | Key | Default           | Description                |
| -------------- | -------- | ---- | --- | ----------------- | -------------------------- |
| `riwayat_id`   | VARCHAR  | 100  | PK  |                   | Order history UUID         |
| `user_id`      | VARCHAR  | 100  | FK  |                   | Reference ke users.user_id |
| `produk_store` | JSON     |      |     |                   | Purchased items (JSON)     |
| `price_total`  | BIGINT   |      |     |                   | Total price in IDR         |
| `time_store`   | DATETIME |      |     | CURRENT_TIMESTAMP | Purchase timestamp         |

**JSON Structure** (produk_store):

```json
[
  {
    "produk_id": "prod_550e8400",
    "produk_name": "Laptop Dell XPS 13",
    "quantity": 1,
    "price_per_unit": 15000000,
    "subtotal": 15000000
  },
  {
    "produk_id": "prod_550e8400e29b",
    "produk_name": "USB-C Hub",
    "quantity": 2,
    "price_per_unit": 250000,
    "subtotal": 500000
  }
]
```

**Example Data**:

```json
{
  "riwayat_id": "order_550e8400",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "produk_store": [
    {
      "produk_id": "prod_123",
      "produk_name": "Laptop",
      "quantity": 1,
      "price_per_unit": 15000000,
      "subtotal": 15000000
    }
  ],
  "price_total": 15000000,
  "time_store": "2026-02-27 12:30:00"
}
```

---

### 7. `invoice` Table

**Purpose**: Store invoice records for transactions

**Creation**: Migration 012

**SQL**:

```sql
CREATE TABLE invoice (
    invoice_id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(100),
    total BIGINT,
    status VARCHAR(20),
    created DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(user_id)
);
```

**Columns**:

| Column       | Type     | Size | Key | Default           | Description                    |
| ------------ | -------- | ---- | --- | ----------------- | ------------------------------ |
| `invoice_id` | VARCHAR  | 100  | PK  |                   | Invoice UUID                   |
| `user_id`    | VARCHAR  | 100  | FK  |                   | Reference ke users.user_id     |
| `total`      | BIGINT   |      |     |                   | Total amount in IDR            |
| `status`     | VARCHAR  | 20   |     |                   | 'pending', 'paid', 'cancelled' |
| `created`    | DATETIME |      |     | CURRENT_TIMESTAMP | Creation timestamp             |

**Status Values**:

- `pending`: Menunggu pembayaran
- `paid`: Sudah dibayar
- `cancelled`: Dibatalkan

**Example Data**:

```json
{
  "invoice_id": "inv_550e8400",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "total": 15000000,
  "status": "paid",
  "created": "2026-02-27 12:30:00"
}
```

---

## 🔗 Entity Relationship Diagram

```
users (1) ─────── (N) sessions
  │
  ├─────────────── (N) riwayat_store
  │
  ├─────────────── (1) saldo
  │
  └─────────────── (N) invoice
        └─────────────── (N) topup

produks (1) ─────── (N) riwayat_store (stored as JSON)
```

---

## 🔍 Database Queries Reference

### User Management

**Create User**:

```sql
INSERT INTO users (user_id, email, username, password, role, created)
VALUES (?, ?, ?, ?, 'user', NOW());
```

**Get User by Email**:

```sql
SELECT * FROM users WHERE email = ?;
```

**Get All Users**:

```sql
SELECT user_id, email, username, role, created FROM users;
```

**Update User**:

```sql
UPDATE users SET username = ?, email = ? WHERE user_id = ?;
```

**Delete User**:

```sql
DELETE FROM users WHERE user_id = ?;
```

---

### Product Management

**Get All Products**:

```sql
SELECT * FROM produks;
```

**Get Product by ID**:

```sql
SELECT * FROM produks WHERE produk_id = ?;
```

**Create Product**:

```sql
INSERT INTO produks
(produk_id, produk_name, price, stock, more_information, upload_created)
VALUES (?, ?, ?, ?, ?, NOW());
```

**Update Stock**:

```sql
UPDATE produks SET stock = stock - ? WHERE produk_id = ?;
```

**Delete Product**:

```sql
DELETE FROM produks WHERE produk_id = ?;
```

---

### Order & Transaction

**Create Order**:

```sql
INSERT INTO riwayat_store
(riwayat_id, user_id, produk_store, price_total, time_store)
VALUES (?, ?, ?, ?, NOW());
```

**Get User Orders**:

```sql
SELECT * FROM riwayat_store WHERE user_id = ? ORDER BY time_store DESC;
```

**Get User Balance**:

```sql
SELECT balance FROM saldo WHERE user_id = ?;
```

**Update Balance**:

```sql
UPDATE saldo SET balance = balance + ? WHERE user_id = ?;
```

---

## 📊 Data Types Reference

| Type         | Size      | Use Case                        |
| ------------ | --------- | ------------------------------- |
| VARCHAR(100) | 100 bytes | IDs, identifiers                |
| VARCHAR(50)  | 50 bytes  | Email, username, role           |
| TEXT         | ~65KB     | Product names, descriptions     |
| JSON         | Variable  | Complex nested data             |
| BIGINT       | 8 bytes   | Large numbers (prices, amounts) |
| INT          | 4 bytes   | Stock quantities                |
| BOOLEAN      | 1 byte    | True/False values               |
| DATETIME     | 8 bytes   | Timestamps                      |

---

## 🔐 Security Considerations

1. **Password Hashing**: All passwords stored as bcrypt hashes
2. **SQL Injection**: Use parameterized queries (?)
3. **Foreign Keys**: Enforce referential integrity
4. **UNIQUE Constraints**: Prevent duplicate emails and user_ids in saldo
5. **JSON Validation**: Validate JSON data before storing
6. **Timestamps**: Use CURRENT_TIMESTAMP for audit trail

---

## 📈 Performance Optimization

### Recommended Indexes

```sql
-- User lookups
CREATE INDEX idx_users_user_id ON users(user_id);

-- Session lookups by user
CREATE INDEX idx_sessions_user_id ON sessions(user_id);

-- Product search
CREATE INDEX idx_produks_name ON produks(produk_name(100));

-- Order history
CREATE INDEX idx_riwayat_user_id ON riwayat_store(user_id);
CREATE INDEX idx_riwayat_created ON riwayat_store(time_store);

-- Balance lookups
CREATE INDEX idx_saldo_user_id ON saldo(user_id);
```

---

## 🔄 Migration Execution Order

Migration files must be executed in this specific order:

1. `001.createTableUsers.sql` - Base users table
2. `002.createdTableSessions.sql` - Session management
3. `003.addPkinUsersTable.sql` - Primary key adjustment
4. `004.createAdminAccess.sql` - Admin related setup
5. `005.createSessionsAdmin.sql` - Admin sessions
6. `006.alterTableSessionsAddIsActive.sql` - Add is_active column
7. `007.changePrimaryKey.sql` - Primary key adjustments
8. `008.createTableProduks.sql` - Products table
9. `009.createTableTopUp.sql` - Top-up transactions
10. `010.createTableSaldo.sql` - User balance
11. `011.createTableRiwayatOrder.sql` - Order history
12. `012.createTableInvoice.sql` - Invoice records

---

## 🧪 Testing Queries

### Verify Database Setup

```sql
-- Check all tables
SHOW TABLES;

-- Check users table structure
DESCRIBE users;

-- Check table relationships
SELECT CONSTRAINT_NAME, TABLE_NAME, COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = DATABASE();

-- Check indexed columns
SHOW INDEX FROM users;
```

---

**Last Updated**: February 27, 2026
