# Backend Porto - Dokumentasi Lengkap

## 📋 Daftar Isi

- [Ikhtisar Proyek](#ikhtisar-proyek)
- [Teknologi & Dependensi](#teknologi--dependensi)
- [Setup & Instalasi](#setup--instalasi)
- [Struktur Proyek](#struktur-proyek)
- [Konfigurasi](#konfigurasi)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Middleware](#middleware)
- [Services & Controllers](#services--controllers)
- [Fitur Utama](#fitur-utama)
- [Error Handling](#error-handling)
- [Development](#development)

---

## 🎯 Ikhtisar Proyek

**Backend Porto** adalah aplikasi backend REST API yang dibangun dengan Node.js dan Express.js. Aplikasi ini menyediakan fitur:

- Manajemen User (Register, Login, Edit Profile, Delete Account)
- Manajemen Produk (CRUD dengan upload gambar)
- Sistem Checkout & Pembayaran
- Topup Saldo & Transaksi
- Role-based Access Control (Admin & User)
- Email Verification & Activation Code
- Session Management

**Versi**: 1.0.0  
**Lisensi**: ISC  
**Type**: ES Module

---

## 🛠️ Teknologi & Dependensi

### Framework & Libraries

| Package           | Versi   | Fungsi                  |
| ----------------- | ------- | ----------------------- |
| **express**       | ^5.2.1  | Web Framework           |
| **mysql2**        | ^3.17.4 | Database Driver         |
| **bcrypt**        | ^6.0.0  | Password Hashing        |
| **jsonwebtoken**  | ^9.0.3  | JWT Authentication      |
| **multer**        | ^2.0.2  | File Upload Handling    |
| **nodemailer**    | ^8.0.1  | Email Service           |
| **cors**          | ^2.8.6  | CORS Middleware         |
| **helmet**        | ^8.1.0  | Security Headers        |
| **cookie-parser** | ^1.4.7  | Cookie Parsing          |
| **morgan**        | ^1.10.1 | HTTP Request Logging    |
| **uuid**          | ^13.0.0 | UUID Generation         |
| **dotenv**        | ^17.3.1 | Environment Variables   |
| **nodemon**       | ^3.1.11 | Auto-reload Development |

---

## 📦 Setup & Instalasi

### Prerequisites

- Node.js >= 16.x
- MySQL/MariaDB Database
- npm atau yarn

### Step 1: Clone & Install Dependencies

```bash
cd backend-porto
npm install
```

### Step 2: Konfigurasi Environment

Buat file `.env` di root directory:

```env
# Server Configuration
NODE_ENV=dev
PORT=3000

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_PORT=3306
DB_DATABASE=backend_porto

# Email Configuration (NodeMailer)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# JWT Secret
JWT_SECRET=your_secret_key

# Other Configuration
UPLOAD_PATH=./uploads
```

### Step 3: Setup Database

```bash
# Jalankan migration files dari src/models/migrations/
# Urutan eksekusi:
1. 001.createTableUsers.sql
2. 002.createdTableSessions.sql
3. 003.addPkinUsersTable.sql
4. 004.createAdminAccess.sql
5. 005.createSessionsAdmin.sql
6. 006.alterTableSessionsAddIsActive.sql
7. 007.changePrimaryKey.sql
8. 008.createTableProduks.sql
9. 009.createTableTopUp.sql
10. 010.createTableSaldo.sql
11. 011.createTableRiwayatOrder.sql
12. 012.createTableInvoice.sql
```

### Step 4: Run Development Server

```bash
npm run dev
```

Server akan berjalan pada `http://localhost:3000`

---

## 📁 Struktur Proyek

```
backend-porto/
├── api/                          # API Entry Point
│   └── index.js                  # API Root
├── public/                       # Static Files
│   ├── Halaman.html             # Main HTML Page
│   └── auth/
│       ├── login.html           # Login Page
│       └── register.html        # Register Page
├── src/
│   ├── app.js                   # Express App Setup
│   ├── local.js                 # Local Development Entry
│   ├── config/                  # Configuration Files
│   │   ├── db.config.js         # Database Connection
│   │   ├── multer.config.js     # File Upload Config
│   │   └── nodeailer.config.js  # Email Config
│   ├── controllers/             # Request Handlers
│   │   ├── auth/
│   │   │   ├── userCreated.controller.js
│   │   │   ├── userLogin.controller.js
│   │   │   ├── useLogoutUser.controller.js
│   │   │   ├── useEditPorfile.controller.js
│   │   │   ├── useDeleteAccount.controller.js
│   │   │   ├── activateCode.controller.js
│   │   │   ├── adminCreated.controller.js
│   │   │   └── userList.controller.js
│   │   ├── checkout/
│   │   │   └── checkout.controller.js
│   │   ├── produks/
│   │   │   ├── produkList.controller.js
│   │   │   ├── produkUpload.controller.js
│   │   │   ├── editProduks.controller.js
│   │   │   ├── deleteProduk.controller.js
│   │   │   └── searchProduksEdit.controller.js
│   │   └── transactions/
│   │       ├── dana.controller.js
│   │       ├── komfirmasiPembayaran.controller.js
│   │       └── topup/
│   ├── middleware/              # Express Middlewares
│   │   ├── checkToken.js
│   │   ├── checkCookieUser.js
│   │   ├── checkInputan.js
│   │   ├── checkBruteForce.js
│   │   ├── produkCheckInputan.js
│   │   ├── validasiRole.js
│   │   ├── validasiTokenCheckout.js
│   │   └── validationsAuthorization.js
│   ├── models/
│   │   ├── migrations/          # SQL Migration Files
│   │   └── repo/                # Data Access Layer
│   │       ├── auth/
│   │       ├── checkout/
│   │       ├── produks/
│   │       └── transactions/
│   ├── routes/                  # API Routes
│   │   ├── auth/users.routes.js
│   │   ├── produk/produk.routes.js
│   │   ├── checkout/checkout.routes.js
│   │   └── transactions/payment.routes.js
│   ├── services/                # Business Logic
│   │   ├── auth/
│   │   ├── checkout/
│   │   ├── produks/
│   │   └── transactions/
│   └── utils/                   # Utility Functions
│       ├── changeFormatRp.js
│       ├── createdAuthorization.js
│       ├── generateUUID.js
│       └── passwordHashing.js
├── testing/                     # Test Files
│   └── auth/register.test.js
├── uploads/                     # Uploaded Files (Images)
├── .env                         # Environment Variables
├── .gitignore
├── package.json
└── README.md                    # This File
```

---

## ⚙️ Konfigurasi

### Database Configuration (`src/config/db.config.js`)

```javascript
// MySQL2 Connection Pool
- Host: localhost (dari .env)
- User: root (dari .env)
- Password: (dari .env)
- Port: 3306 (dari .env)
- Connection Limit: 10
- Timezone: Z (UTC)
```

### Multer Configuration (`src/config/multer.config.js`)

```javascript
// File Upload
- Destination: ./uploads
- Max File Size: Sesuai konfigurasi
- Allowed Types: Images
```

### NodeMailer Configuration (`src/config/nodeailer.config.js`)

```javascript
// Email Service
- Service: Gmail
- Credentials dari .env
```

---

## 🗄️ Database Schema

### 1. **Users Table**

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

**Kolom**:

- `user_id`: Unique identifier (UUID)
- `email`: Email address (Primary Key)
- `username`: Username
- `password`: Hashed password (bcrypt)
- `role`: User role ('user', 'admin')
- `created`: Timestamp registrasi

---

### 2. **Sessions Table**

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

**Fungsi**: Store JWT tokens dan session info

---

### 3. **Produks Table**

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

**Kolom**:

- `produk_id`: Product UUID
- `produk_name`: Nama produk
- `price`: Harga produk (IDR)
- `stock`: Stok tersedia
- `more_information`: Detail produk (JSON format)
- `upload_created`: Waktu upload

---

### 4. **TopUp Table**

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

---

### 5. **Saldo Table**

```sql
CREATE TABLE saldo (
    saldo_id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(100) UNIQUE,
    balance BIGINT DEFAULT 0,
    FOREIGN KEY(user_id) REFERENCES users(user_id)
);
```

---

### 6. **Riwayat Order Table**

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

---

### 7. **Invoice Table**

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

---

## 🔌 API Endpoints

### Base URL: `http://localhost:3000/api`

### Health Check

```
GET /health
├── Response: { status: true, message: "server is alive" }
└── Status: 200 OK
```

---

## 👤 AUTH ENDPOINTS (`/auth`)

### 1. Health Check

```
GET /auth/health
Response: { status: true, message: "users endpoint is alive" }
```

### 2. Register User

```
POST /users/created
Headers: Content-Type: application/json
Body: {
    email: string (required),
    username: string (required),
    password: string (required)
}
Response: {
    status: boolean,
    message: string,
    data: { user_id, email, username, role }
}
```

### 3. Login User

```
POST /users/login
Headers: Content-Type: application/json
Body: {
    email: string (required),
    password: string (required)
}
Response: {
    status: boolean,
    message: string,
    data: { token, user_id, email, username, role }
}
Cookies: Set-Cookie (JWT Token)
```

### 4. Logout User

```
POST /users/logout
Headers: Cookie (JWT Token required)
Response: {
    status: boolean,
    message: "Logout successful"
}
```

### 5. Edit Profile

```
PATCH /users/edit
Headers: Cookie (JWT Token required)
Body: {
    username?: string,
    password?: string,
    email?: string
}
Response: {
    status: boolean,
    message: string,
    data: { updated user info }
}
```

### 6. Delete Account

```
DELETE /users/delete
Headers: Cookie (JWT Token required)
Body: {
    password: string (required for confirmation)
}
Response: {
    status: boolean,
    message: "Account deleted successfully"
}
```

### 7. Activate Account Code

```
POST /users/activate-code
Headers: Cookie (JWT Token required)
Body: {
    activation_code: string (required)
}
Response: {
    status: boolean,
    message: string,
    data: { activation details }
}
```

### 8. Create Admin Account

```
POST /users/admin/created
Headers: Cookie (Admin JWT Token required)
Middleware: validasiRole (Admin only)
Body: {
    email: string,
    username: string,
    password: string
}
Response: {
    status: boolean,
    message: string,
    data: { new admin user info }
}
```

### 9. Get Users List

```
GET /users/list
Headers: Cookie (Admin JWT Token required)
Middleware: validasiRole (Admin only)
Response: {
    status: boolean,
    data: [ ... array of users ... ]
}
```

---

## 🛍️ PRODUK ENDPOINTS (`/produks`)

### 1. Get All Products

```
GET /produks/list
Headers: Cookie (User JWT Token required)
Middleware: validasiRole (Admin only)
Response: {
    status: boolean,
    data: [
        {
            produk_id: string,
            produk_name: string,
            price: number,
            stock: number,
            more_information: object,
            upload_created: datetime
        }, ...
    ]
}
```

### 2. Upload Product

```
POST /produks/uploads
Headers:
    - Cookie (JWT Token required)
    - Content-Type: multipart/form-data
Middleware: validasiRole (Admin only)
Body (FormData):
    - images: File (image only)
    - produk_name: string
    - price: number
    - stock: number
    - more_information: JSON
Response: {
    status: boolean,
    message: string,
    data: { produk_id, produk_name, price, stock, image_url }
}
```

### 3. Search Product (Public)

```
GET /produks/searchProduks/:produks_id
Response: {
    status: boolean,
    data: {
        produk_id: string,
        produk_name: string,
        price: number,
        stock: number,
        more_information: object
    }
}
```

### 4. Edit Product

```
PATCH /produks/edit/:produks_id
Headers: Cookie (JWT Token required)
Middleware: validasiRole (Admin only)
Body: {
    produk_name?: string,
    price?: number,
    stock?: number,
    more_information?: object
}
Response: {
    status: boolean,
    message: string,
    data: { updated product info }
}
```

### 5. Delete Product

```
DELETE /produks/delete/:produks_id
Headers: Cookie (JWT Token required)
Middleware: validasiRole (Admin only)
Response: {
    status: boolean,
    message: "Product deleted successfully"
}
```

---

## 💳 CHECKOUT ENDPOINTS (`/client`)

### 1. Create Checkout

```
POST /client/checkouts
Headers:
    - Authorization: Bearer {token}
    - Content-Type: application/json
Body: {
    items: [
        {
            produk_id: string,
            quantity: number,
            price: number
        }, ...
    ],
    user_id: string,
    total_price: number
}
Response: {
    status: boolean,
    message: string,
    data: {
        checkout_id: string,
        user_id: string,
        items: array,
        total_price: number,
        status: "pending"
    }
}
```

---

## 💰 TRANSACTION ENDPOINTS (`/transaction`)

### 1. Payment via Dana

```
POST /transaction/dana
Headers:
    - Cookie (JWT Token required)
    - Authorization: Bearer {token}
Body: {
    amount: number,
    phone_number: string
}
Response: {
    status: boolean,
    message: string,
    data: { transaction_id, status: "pending" }
}
```

### 2. Top Up Saldo

```
POST /transaction/topup
Headers:
    - Cookie (JWT Token required)
    - Authorization: Bearer {token}
Body: {
    amount: number,
    payment_method: string
}
Response: {
    status: boolean,
    message: string,
    data: { topup_id, amount, status: "pending" }
}
```

### 3. Confirm Payment

```
POST /transaction/konfirmasi-pembayaran
Headers:
    - Cookie (JWT Token required)
    - Authorization: Bearer {token}
Body: {
    transaction_id: string,
    payment_proof?: File (optional)
}
Response: {
    status: boolean,
    message: string,
    data: { transaction_id, status: "confirmed" }
}
```

---

## 🔐 Middleware

### 1. **checkToken.js**

- **Fungsi**: Verify JWT token dari header Authorization
- **Return**: Decoded token data
- **Error**: 401 Unauthorized jika token invalid

### 2. **checkCookieUser.js**

- **Fungsi**: Verify JWT token dari cookies
- **Return**: User information dari token
- **Error**: 401 jika cookie tidak valid

### 3. **checkInputan.js**

- **Fungsi**: Validate user input pada registration/login
- **Validate**:
  - Email format
  - Password strength
  - Required fields
- **Error**: 400 Bad Request jika validation gagal

### 4. **checkBruteForce.js**

- **Fungsi**: Prevent brute force attacks pada login
- **Limit**: Max attempts per IP
- **Lockout**: Temporary block after max attempts

### 5. **produkCheckInputan.js**

- **Fungsi**: Validate product upload input
- **Validate**:
  - File type (image only)
  - File size
  - Required fields
- **Error**: 400 jika validation gagal

### 6. **validasiRole.js**

- **Fungsi**: Check user role (Admin-only routes)
- **Allow**: Only 'admin' role
- **Error**: 403 Forbidden jika bukan admin

### 7. **validasiTokenCheckout.js**

- **Fungsi**: Validate authorization token untuk checkout
- **Check**: Token validity dan expiration
- **Error**: 401 jika token invalid

### 8. **validationsAuthorization.js**

- **Fungsi**: Validate authorization header
- **Format**: Bearer {token}
- **Error**: 401 jika header invalid

---

## 🔧 Services & Controllers

### Auth Services

**Location**: `src/services/auth/`

- **userCreated.service.js**: Register user logic
  - Hash password dengan bcrypt
  - Create session
  - Send activation email
- **tokenVerif.service.js**: JWT token verification
  - Verify token signature
  - Check expiration
- **adminCreated.service.js**: Create admin account logic

### Product Services

**Location**: `src/services/produks/`

- Product CRUD operations
- Image upload handling
- Stock management

### Checkout Services

**Location**: `src/services/checkout/`

- Checkout validation
- Order creation
- Payment processing

### Transaction Services

**Location**: `src/services/transactions/`

- Payment processing
- TopUp handling
- Balance updates

---

## ✨ Fitur Utama

### 1. **User Authentication & Authorization**

- JWT-based authentication
- Role-based access control (Admin/User)
- Cookie-based session management
- Password hashing dengan bcrypt
- Email verification dengan activation code

### 2. **Product Management**

- CRUD operations untuk produk
- Image upload dengan multer
- Stock tracking
- Admin-only access

### 3. **E-Commerce Features**

- Shopping cart management
- Checkout system
- Order history tracking

### 4. **Payment System**

- Multiple payment methods (Dana, TopUp)
- Payment confirmation
- Transaction logging
- Balance/Saldo management

### 5. **Security**

- Helmet.js untuk secure headers
- CORS configuration
- Brute force protection
- Input validation
- SQL injection prevention (parameterized queries)

### 6. **Email Service**

- Account activation emails
- User verification
- Notification delivery

---

## ❌ Error Handling

### Standard Error Response

```json
{
  "status": false,
  "message": "error description",
  "error": "error details"
}
```

### Common HTTP Status Codes

| Code | Meaning                        |
| ---- | ------------------------------ |
| 200  | OK - Request successful        |
| 201  | Created - Resource created     |
| 400  | Bad Request - Invalid input    |
| 401  | Unauthorized - Auth required   |
| 403  | Forbidden - No permission      |
| 404  | Not Found - Resource not found |
| 500  | Server Error - Internal error  |

### Error Handling Middleware (`src/app.js`)

```javascript
// Development mode - Shows full error details
if (process.env.NODE_ENV === "dev") {
  return { status: false, message: "error", error, err_stack };
}

// Production mode - Hide sensitive details
return { status: false, message: "error", error: err.message };
```

---

## 🚀 Development

### Run Development Server

```bash
npm run dev
```

Uses nodemon untuk auto-reload

### Project Scripts

```json
{
  "dev": "nodemon ./src/local.js",
  "test": "echo \"Error: no test specified\" && exit 1"
}
```

### Logging

- HTTP request logging dengan morgan
- Development-friendly output format

### CORS Configuration

```javascript
origin: "http://localhost:3000";
credentials: true;
```

---

## 📝 Notes

1. **File Uploads**: Disimpan di folder `./uploads`
2. **JWT Tokens**: Disimpan di cookies dengan HttpOnly flag
3. **Database**: MySQL/MariaDB dengan connection pooling
4. **Environment**: Gunakan .env untuk semua config sensitive
5. **Node Version**: ES6+ dengan `"type": "module"` di package.json

---

## 🤝 Contributing

Feel free untuk contribute improvements dan bug fixes.

---

## 📞 Support

Untuk pertanyaan atau issues, silahkan buat issue di repository.

---

**Last Updated**: February 27, 2026
