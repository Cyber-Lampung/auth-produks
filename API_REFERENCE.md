# API Reference Guide

## 📚 Complete API Reference

### Base URL

```
http://localhost:3000/api
```

### Response Format

Semua responses mengikuti format berikut:

**Success Response**:

```json
{
  "status": true,
  "message": "Success message",
  "data": {
    /* response data */
  }
}
```

**Error Response**:

```json
{
  "status": false,
  "message": "Error message",
  "error": "Error details"
}
```

---

## 🔷 1. HEALTH CHECKS

### Server Health Check

```http
GET /health
```

**Response** (200 OK):

```json
{
  "status": true,
  "message": "server is alive"
}
```

### Auth Endpoint Health

```http
GET /auth/health
```

**Response** (200 OK):

```json
{
  "status": true,
  "message": "users endpoint is alive"
}
```

---

## 👥 2. AUTHENTICATION ENDPOINTS

### 2.1 Register New User

```http
POST /users/created
Content-Type: application/json
```

**Request Body**:

```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "SecurePassword123!"
}
```

**Response** (201 Created):

```json
{
  "status": true,
  "message": "User registered successfully",
  "data": {
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "username": "johndoe",
    "role": "user",
    "created": "2026-02-27T10:30:00Z"
  }
}
```

**Middleware**: `checkInputan`

- Validates email format
- Checks password strength
- Validates required fields

**Errors**:

- 400: Invalid email format
- 400: Weak password
- 409: Email already registered

---

### 2.2 Login User

```http
POST /users/login
Content-Type: application/json
```

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response** (200 OK):

```json
{
  "status": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "username": "johndoe",
    "role": "user"
  }
}
```

**Cookies Set**:

```
Set-Cookie: jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Path=/
```

**Middleware**: `checkInputan`

- Validates input fields

**Errors**:

- 400: Invalid credentials
- 401: Email not found
- 401: Wrong password

---

### 2.3 Logout User

```http
POST /users/logout
Cookie: jwt=<token>
```

**Response** (200 OK):

```json
{
  "status": true,
  "message": "Logout successful"
}
```

**Cookies Cleared**:

```
Set-Cookie: jwt=; Max-Age=0; Path=/
```

**Middleware**: `checkCookieUser`

- Validates JWT token in cookies

**Errors**:

- 401: Invalid or missing token

---

### 2.4 Edit User Profile

```http
PATCH /users/edit
Content-Type: application/json
Cookie: jwt=<token>
```

**Request Body** (semua optional):

```json
{
  "username": "newusername",
  "email": "newemail@example.com",
  "password": "NewPassword123!"
}
```

**Response** (200 OK):

```json
{
  "status": true,
  "message": "Profile updated successfully",
  "data": {
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "newemail@example.com",
    "username": "newusername"
  }
}
```

**Middleware**: `checkCookieUser`

**Errors**:

- 401: Unauthorized
- 400: Invalid new email format
- 409: Email already in use

---

### 2.5 Delete User Account

```http
DELETE /users/delete
Content-Type: application/json
Cookie: jwt=<token>
```

**Request Body**:

```json
{
  "password": "CurrentPassword123!"
}
```

**Response** (200 OK):

```json
{
  "status": true,
  "message": "Account deleted successfully"
}
```

**Middleware**: `checkCookieUser`

**Errors**:

- 401: Unauthorized
- 401: Incorrect password
- 400: Password required

---

### 2.6 Activate Account Code

```http
POST /users/activate-code
Content-Type: application/json
Cookie: jwt=<token>
```

**Request Body**:

```json
{
  "activation_code": "123456"
}
```

**Response** (200 OK):

```json
{
  "status": true,
  "message": "Account activated successfully",
  "data": {
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "is_active": true
  }
}
```

**Middleware**: `checkCookieUser`

**Errors**:

- 401: Unauthorized
- 400: Invalid or expired code

---

### 2.7 Create Admin Account

```http
POST /users/admin/created
Content-Type: application/json
Cookie: jwt=<admin_token>
```

**Request Body**:

```json
{
  "email": "admin@example.com",
  "username": "adminuser",
  "password": "AdminPassword123!"
}
```

**Response** (201 Created):

```json
{
  "status": true,
  "message": "Admin account created successfully",
  "data": {
    "user_id": "550e8400-e29b-41d4-a716-446655440001",
    "email": "admin@example.com",
    "username": "adminuser",
    "role": "admin"
  }
}
```

**Middleware**:

- `checkCookieUser`
- `validasiRole` (Admin only)

**Errors**:

- 401: Unauthorized
- 403: Forbidden - Admin role required
- 409: Email already exists

---

### 2.8 Get Users List

```http
GET /users/list
Cookie: jwt=<admin_token>
```

**Response** (200 OK):

```json
{
  "status": true,
  "data": [
    {
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "username": "johndoe",
      "role": "user",
      "created": "2026-02-27T10:30:00Z"
    },
    {
      "user_id": "550e8400-e29b-41d4-a716-446655440001",
      "email": "admin@example.com",
      "username": "adminuser",
      "role": "admin",
      "created": "2026-02-27T08:00:00Z"
    }
  ]
}
```

**Middleware**:

- `checkCookieUser`
- `validasiRole` (Admin only)

**Errors**:

- 401: Unauthorized
- 403: Admin role required

---

## 📦 3. PRODUCT ENDPOINTS

### 3.1 Get All Products

```http
GET /produks/list
Cookie: jwt=<admin_token>
```

**Response** (200 OK):

```json
{
  "status": true,
  "data": [
    {
      "produk_id": "prod_123456",
      "produk_name": "Laptop Dell XPS",
      "price": 15000000,
      "stock": 5,
      "more_information": {
        "processor": "Intel i7",
        "ram": "16GB",
        "storage": "512GB SSD"
      },
      "upload_created": "2026-02-27T10:00:00Z"
    }
  ]
}
```

**Middleware**:

- `checkCookieUser`
- `validasiRole` (Admin only)

**Errors**:

- 401: Unauthorized
- 403: Admin role required

---

### 3.2 Upload Product

```http
POST /produks/uploads
Content-Type: multipart/form-data
Cookie: jwt=<admin_token>
```

**Form Data**:

```
images: [Binary File] (required)
produk_name: "Laptop Dell XPS" (required)
price: 15000000 (required)
stock: 5 (required)
more_information: {"processor":"Intel i7","ram":"16GB"} (optional)
```

**Response** (201 Created):

```json
{
  "status": true,
  "message": "Product uploaded successfully",
  "data": {
    "produk_id": "prod_123456",
    "produk_name": "Laptop Dell XPS",
    "price": 15000000,
    "stock": 5,
    "image_url": "/uploads/prod_123456.jpg",
    "upload_created": "2026-02-27T10:00:00Z"
  }
}
```

**Middleware**:

- `checkCookieUser`
- `validasiRole` (Admin only)
- `upload.single("images", 5)` (Max 5MB)
- `checkInputanProduk`

**Errors**:

- 400: Invalid file type
- 400: File too large
- 400: Required fields missing
- 401: Unauthorized
- 403: Admin role required

---

### 3.3 Search Product (Public)

```http
GET /produks/searchProduks/:produks_id
```

**URL Parameters**:

- `produks_id`: Product ID (string, required)

**Response** (200 OK):

```json
{
  "status": true,
  "data": {
    "produk_id": "prod_123456",
    "produk_name": "Laptop Dell XPS",
    "price": 15000000,
    "stock": 5,
    "more_information": {
      "processor": "Intel i7",
      "ram": "16GB",
      "storage": "512GB SSD"
    }
  }
}
```

**Errors**:

- 404: Product not found

---

### 3.4 Edit Product

```http
PATCH /produks/edit/:produks_id
Content-Type: application/json
Cookie: jwt=<admin_token>
```

**URL Parameters**:

- `produks_id`: Product ID (required)

**Request Body** (semua optional):

```json
{
  "produk_name": "Updated Product Name",
  "price": 20000000,
  "stock": 10,
  "more_information": {
    "processor": "Intel i9",
    "ram": "32GB"
  }
}
```

**Response** (200 OK):

```json
{
  "status": true,
  "message": "Product updated successfully",
  "data": {
    "produk_id": "prod_123456",
    "produk_name": "Updated Product Name",
    "price": 20000000,
    "stock": 10
  }
}
```

**Middleware**:

- `checkCookieUser`
- `validasiRole` (Admin only)

**Errors**:

- 404: Product not found
- 401: Unauthorized
- 403: Admin role required

---

### 3.5 Delete Product

```http
DELETE /produks/delete/:produks_id
Cookie: jwt=<admin_token>
```

**URL Parameters**:

- `produks_id`: Product ID (required)

**Response** (200 OK):

```json
{
  "status": true,
  "message": "Product deleted successfully"
}
```

**Middleware**:

- `checkCookieUser`
- `validasiRole` (Admin only)

**Errors**:

- 404: Product not found
- 401: Unauthorized
- 403: Admin role required

---

## 💳 4. CHECKOUT ENDPOINTS

### 4.1 Create Checkout

```http
POST /client/checkouts
Content-Type: application/json
Authorization: Bearer <token>
```

**Request Body**:

```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "items": [
    {
      "produk_id": "prod_123456",
      "quantity": 2,
      "price": 15000000
    }
  ],
  "total_price": 30000000
}
```

**Response** (201 Created):

```json
{
  "status": true,
  "message": "Checkout successful",
  "data": {
    "checkout_id": "checkout_789",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "items": [
      {
        "produk_id": "prod_123456",
        "quantity": 2,
        "price": 15000000,
        "subtotal": 30000000
      }
    ],
    "total_price": 30000000,
    "status": "pending",
    "created": "2026-02-27T10:30:00Z"
  }
}
```

**Middleware**:

- `validasiAuthrozationToken`
- `validasiMiddlewareCheckout`

**Errors**:

- 400: Invalid items
- 401: Unauthorized
- 400: Insufficient stock

---

## 💰 5. TRANSACTION ENDPOINTS

### 5.1 Payment via Dana

```http
POST /transaction/dana
Content-Type: application/json
Cookie: jwt=<token>
Authorization: Bearer <token>
```

**Request Body**:

```json
{
  "amount": 50000,
  "phone_number": "+6281234567890"
}
```

**Response** (201 Created):

```json
{
  "status": true,
  "message": "Payment request sent to Dana",
  "data": {
    "transaction_id": "txn_123456",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "amount": 50000,
    "payment_method": "dana",
    "status": "pending",
    "created": "2026-02-27T10:30:00Z"
  }
}
```

**Middleware**:

- `checkCookieUser`
- `validasiAuthrozationToken`

**Errors**:

- 401: Unauthorized
- 400: Invalid amount
- 400: Invalid phone number

---

### 5.2 Top Up Saldo

```http
POST /transaction/topup
Content-Type: application/json
Cookie: jwt=<token>
Authorization: Bearer <token>
```

**Request Body**:

```json
{
  "amount": 100000,
  "payment_method": "bank_transfer"
}
```

**Response** (201 Created):

```json
{
  "status": true,
  "message": "Top up created successfully",
  "data": {
    "topup_id": "topup_123456",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "amount": 100000,
    "payment_method": "bank_transfer",
    "status": "pending",
    "created": "2026-02-27T10:30:00Z"
  }
}
```

**Middleware**:

- `checkCookieUser`
- `validasiAuthrozationToken`

**Errors**:

- 401: Unauthorized
- 400: Invalid amount
- 400: Invalid payment method

---

### 5.3 Confirm Payment

```http
POST /transaction/konfirmasi-pembayaran
Content-Type: application/json
Cookie: jwt=<token>
Authorization: Bearer <token>
```

**Request Body**:

```json
{
  "transaction_id": "txn_123456"
}
```

**Response** (200 OK):

```json
{
  "status": true,
  "message": "Payment confirmed successfully",
  "data": {
    "transaction_id": "txn_123456",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "amount": 50000,
    "status": "confirmed",
    "confirmed_at": "2026-02-27T10:35:00Z"
  }
}
```

**Middleware**:

- `checkCookieUser`
- `validasiAuthrozationToken`

**Errors**:

- 404: Transaction not found
- 401: Unauthorized
- 400: Transaction already confirmed

---

## 🔑 Authentication Headers

### JWT Token in Cookies

```http
Cookie: jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Bearer Token in Authorization

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### JWT Payload Example

```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "username": "johndoe",
  "role": "user",
  "iat": 1709043000,
  "exp": 1709129400
}
```

---

## 📊 Status Codes Reference

| Code | Status       | Description                              |
| ---- | ------------ | ---------------------------------------- |
| 200  | OK           | Request successful                       |
| 201  | Created      | Resource created successfully            |
| 400  | Bad Request  | Invalid input or validation error        |
| 401  | Unauthorized | Authentication required or failed        |
| 403  | Forbidden    | Access denied (insufficient permissions) |
| 404  | Not Found    | Resource not found                       |
| 409  | Conflict     | Resource already exists                  |
| 500  | Server Error | Internal server error                    |

---

## 🧪 Example API Calls

### Using cURL

**Register**:

```bash
curl -X POST http://localhost:3000/api/users/created \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "johndoe",
    "password": "SecurePassword123!"
  }'
```

**Login**:

```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }'
```

**Get Products** (with JWT):

```bash
curl -X GET http://localhost:3000/api/produks/list \
  -H "Cookie: jwt=<your_jwt_token>"
```

### Using Postman

1. Create environment variables:
   - `base_url`: http://localhost:3000/api
   - `jwt_token`: (dari response login)

2. Import collection atau buat manual:
   - POST {{base_url}}/users/created
   - POST {{base_url}}/users/login
   - GET {{base_url}}/produks/list

---

**Last Updated**: February 27, 2026
