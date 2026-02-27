# Configuration & Setup Guide

## 🔧 Environment Configuration

### 1. Environment Variables (.env)

Create a `.env` file in the root directory with the following configuration:

```env
# ==========================================
# SERVER CONFIGURATION
# ==========================================

# Node environment (dev, staging, production)
NODE_ENV=dev

# Server port
PORT=3000

# ==========================================
# DATABASE CONFIGURATION
# ==========================================

# MySQL/MariaDB Connection
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_db_password
DB_PORT=3306
DB_DATABASE=backend_porto

# ==========================================
# JWT CONFIGURATION
# ==========================================

# JWT secret key (use a strong, random string)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# JWT expiration time (e.g., 24h, 7d)
JWT_EXPIRE=24h

# ==========================================
# EMAIL CONFIGURATION (NodeMailer)
# ==========================================

# Email service provider
EMAIL_SERVICE=gmail

# Email address (sender)
EMAIL_USER=your_email@gmail.com

# Email password or App-specific password (for Gmail)
EMAIL_PASSWORD=your_app_password

# ==========================================
# FILE UPLOAD CONFIGURATION
# ==========================================

# Upload directory path
UPLOAD_PATH=./uploads

# Max file size (bytes) - 5MB
MAX_FILE_SIZE=5242880

# ==========================================
# CORS CONFIGURATION
# ==========================================

# Allowed origin for CORS
CORS_ORIGIN=http://localhost:3000

# ==========================================
# FRONTEND CONFIGURATION
# ==========================================

# Frontend URL
FRONTEND_URL=http://localhost:3000

# ==========================================
# API CONFIGURATION
# ==========================================

# API base URL
API_BASE_URL=http://localhost:3001/api

# Client/External API authorization token (if needed)
CLIENT_AUTH_TOKEN=your_client_auth_token
```

---

### 2. Database Configuration (`src/config/db.config.js`)

**Current Configuration**:

```javascript
import mysql from "mysql2/promise";
import * as dotenv from "dotenv";
dotenv.config();

const db = await mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  ssl: {
    rejectUnauthorized: true,
  },
  timezone: "Z",
  connectionLimit: 10,
  queueLimit: 0,
});

export default db;
```

**Configuration Options**:

| Option                    | Default   | Description                      |
| ------------------------- | --------- | -------------------------------- |
| `host`                    | localhost | Database server hostname         |
| `user`                    | root      | Database user                    |
| `password`                | -         | Database password                |
| `port`                    | 3306      | Database port                    |
| `database`                | -         | Database name                    |
| `connectionLimit`         | 10        | Max concurrent connections       |
| `queueLimit`              | 0         | Unlimited queue (0 = unlimited)  |
| `timezone`                | Z         | UTC timezone                     |
| `waitForConnections`      | true      | Queue requests if no connections |
| `enableKeepAlive`         | true      | Keep connections alive           |
| `keepAliveInitialDelayMs` | 0         | Delay before first keepalive     |

**SSL Configuration** (Production):

```javascript
ssl: {
  rejectUnauthorized: true,  // Verify SSL certificate
  ca: fs.readFileSync('path/to/ca.pem'),  // CA certificate
  key: fs.readFileSync('path/to/key.pem'), // Client key
  cert: fs.readFileSync('path/to/cert.pem') // Client certificate
}
```

---

### 3. Multer File Upload Configuration (`src/config/multer.config.js`)

**Setup**:

```javascript
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "../../uploads");

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Rename file dengan random string
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

// File filter untuk images only
const fileFilter = (req, file, cb) => {
  const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export default upload;
```

**Usage in Routes**:

```javascript
router.post(
  "/produks/uploads",
  upload.single("images", 5), // Field name: "images", max 5 files
  checkInputanProduk,
  produkUploadController,
);
```

---

### 4. NodeMailer Configuration (`src/config/nodeailer.config.js`)

**Gmail Setup** (Development):

```javascript
import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD, // App-specific password
  },
});

// Usage
export const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      html: html,
    });
  } catch (error) {
    console.error("Email send error:", error);
  }
};

export default transporter;
```

**Gmail App Password Setup**:

1. Enable 2-Factor Authentication on Google Account
2. Go to myaccount.google.com/apppasswords
3. Select "Mail" and "Windows Computer"
4. Copy the generated 16-character password
5. Use this password in `EMAIL_PASSWORD`

**Alternative Providers**:

**Outlook/Hotmail**:

```javascript
service: 'outlook',
auth: {
  user: 'your-email@outlook.com',
  pass: 'your-password'
}
```

**Custom SMTP**:

```javascript
const transporter = nodemailer.createTransport({
  host: "smtp.example.com",
  port: 587,
  secure: false, // true for 465, false for 587
  auth: {
    user: "your-email@example.com",
    pass: "your-password",
  },
});
```

---

### 5. Express App Configuration (`src/app.js`)

**CORS Setup**:

```javascript
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true, // Allow cookies
  }),
);
```

**Helmet Security Headers**:

```javascript
app.use(
  helmet({
    crossOriginResourcePolicy: false, // Allow image serving
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  }),
);
```

**Static Files**:

```javascript
app.use(express.static("public"));
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
```

**Body Parser**:

```javascript
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
```

---

## 🔐 Security Configuration

### 1. Password Security

**Bcrypt Configuration** (`src/utils/passwordHashing.js`):

```javascript
import bcrypt from "bcrypt";

const saltRounds = 10; // Cost factor

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, saltRounds);
};

export const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};
```

**Password Requirements** (Validation):

- Min 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character (!@#$%^&\*)

---

### 2. JWT Configuration

**Token Creation**:

```javascript
import jwt from "jsonwebtoken";

const createToken = (payload, expiresIn = "24h") => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: expiresIn,
    algorithm: "HS256",
  });
};
```

**Token Verification**:

```javascript
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};
```

**Payload Structure**:

```javascript
{
  user_id: "550e8400-e29b-41d4-a716-446655440000",
  email: "user@example.com",
  username: "johndoe",
  role: "user",
  iat: 1709043000,
  exp: 1709129400
}
```

---

### 3. Cookie Configuration

**Secure Cookie Settings**:

```javascript
// In login controller
res.cookie("jwt", token, {
  httpOnly: true, // Prevent XSS attacks
  secure: true, // HTTPS only (production)
  sameSite: "Strict", // CSRF protection
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
});
```

---

## 🌐 Deployment Configuration

### Development Environment

```env
NODE_ENV=dev
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=dev_password
JWT_SECRET=dev_secret_key_not_secure
CORS_ORIGIN=http://localhost:3000
```

### Staging Environment

```env
NODE_ENV=staging
DB_HOST=staging-db.example.com
DB_USER=staging_user
DB_PASSWORD=staging_secure_password
JWT_SECRET=staging_secret_key_long_and_secure
CORS_ORIGIN=https://staging.example.com
```

### Production Environment

```env
NODE_ENV=production
DB_HOST=prod-db.example.com
DB_USER=prod_user
DB_PASSWORD=very_secure_password_use_secrets_manager
JWT_SECRET=production_secret_key_very_long_and_secure
CORS_ORIGIN=https://example.com
UPLOAD_PATH=/var/uploads
```

---

## 📝 Environment Variables Checklist

Before deployment, ensure all variables are configured:

- [ ] `NODE_ENV` set correctly
- [ ] `PORT` configured
- [ ] `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_PORT`, `DB_DATABASE` valid
- [ ] `JWT_SECRET` is strong (min 32 characters)
- [ ] `EMAIL_SERVICE`, `EMAIL_USER`, `EMAIL_PASSWORD` configured
- [ ] `CORS_ORIGIN` points to correct frontend URL
- [ ] `UPLOAD_PATH` exists and is writable
- [ ] Database migrations executed in correct order
- [ ] Upload directory created with proper permissions

---

## 🚀 Configuration for Different Environments

### Local Development

```javascript
// src/local.js
import app from "./app.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### Docker Configuration (Optional)

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

### Docker Compose

```yaml
version: "3.8"

services:
  backend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DB_HOST=mysql
      - DB_USER=root
      - DB_PASSWORD=password
    depends_on:
      - mysql

  mysql:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=password
      - MYSQL_DATABASE=backend_porto
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

---

## 🔄 Configuration Validation

**Validate Configuration on Startup** (`src/config/validate.js`):

```javascript
export const validateConfig = () => {
  const required = [
    "DB_HOST",
    "DB_USER",
    "DB_PASSWORD",
    "DB_DATABASE",
    "JWT_SECRET",
    "EMAIL_USER",
    "EMAIL_PASSWORD",
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required env variables: ${missing.join(", ")}`);
  }

  console.log("✓ All required environment variables are configured");
};
```

**Usage in app.js**:

```javascript
import { validateConfig } from "./config/validate.js";

validateConfig();
```

---

## 📊 Performance Configuration

### Connection Pool Settings

```javascript
const pool = mysql.createPool({
  connectionLimit: 10, // Adjust based on load
  queueLimit: 0, // Unlimited queue
  waitForConnections: true,
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0,
});
```

### Recommended Pool Sizes

- **Development**: 5-10 connections
- **Staging**: 10-20 connections
- **Production**: 20-50 connections (scale with traffic)

### Express Middleware Order (Optimized)

```javascript
app.use(express.json()); // Body parsing
app.use(helmet()); // Security headers
app.use(cors({ origin: process.env.CORS_ORIGIN })); // CORS
app.use(cookieParser()); // Cookies
app.use(morgan("dev")); // Logging
app.use(express.static("public")); // Static files
```

---

**Last Updated**: February 27, 2026
