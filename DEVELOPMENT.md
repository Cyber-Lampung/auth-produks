# Development Guide & Best Practices

## 🚀 Quick Start

### Prerequisites

- Node.js >= 16.x
- MySQL/MariaDB 8.0+
- npm or yarn
- Git

### Setup Steps

1. **Clone Repository**

```bash
git clone <repository-url>
cd backend-porto
```

2. **Install Dependencies**

```bash
npm install
```

3. **Configure Environment**

```bash
cp .env.example .env
# Edit .env with your settings
```

4. **Setup Database**

```bash
# Run migrations in order (001 to 012)
mysql -u root -p backend_porto < src/models/migrations/001.createTableUsers.sql
# ... repeat for all migration files
```

5. **Start Development Server**

```bash
npm run dev
```

The server will start on `http://localhost:3000`

---

## 📁 Project Structure Guide

### Controllers (`src/controllers/`)

**Responsibility**: Handle HTTP requests and responses

**Pattern**:

```javascript
// controllers/auth/userCreated.controller.js
import { createUserService } from "../../services/auth/useCreatedUser.service.js";

const userCreatedController = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;

    // Validate input
    if (!email || !username || !password) {
      return res.status(400).json({
        status: false,
        message: "All fields required",
      });
    }

    // Call service
    const result = await createUserService(email, username, password);

    return res.status(201).json({
      status: true,
      message: "User created successfully",
      data: result,
    });
  } catch (error) {
    next(error); // Pass to error handler
  }
};

export default userCreatedController;
```

**Key Points**:

- Use try-catch for error handling
- Validate input before processing
- Call services for business logic
- Return consistent response format
- Use `next(error)` for error middleware

---

### Services (`src/services/`)

**Responsibility**: Business logic and data operations

**Pattern**:

```javascript
// services/auth/useCreatedUser.service.js
import db from "../../config/db.config.js";
import { hashPassword } from "../../utils/passwordHashing.js";
import { generateUUID } from "../../utils/generateUUID.js";

export const createUserService = async (email, username, password) => {
  // Validate business rules
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new Error("Email already registered");
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Generate UUID
  const userId = generateUUID();

  // Insert into database
  const [result] = await db.query(
    "INSERT INTO users (user_id, email, username, password, role, created) VALUES (?, ?, ?, ?, ?, NOW())",
    [userId, email, username, hashedPassword, "user"],
  );

  return {
    user_id: userId,
    email,
    username,
    role: "user",
  };
};

const getUserByEmail = async (email) => {
  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0];
};
```

**Key Points**:

- Contain business logic
- Interact with database
- Call utilities for common tasks
- Throw errors for exception cases
- Return clean data for controllers

---

### Middleware (`src/middleware/`)

**Responsibility**: Process requests before reaching controllers

**Pattern**:

```javascript
// middleware/checkToken.js
import jwt from "jsonwebtoken";

const checkToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Token required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      status: false,
      message: "Invalid token",
    });
  }
};

export default checkToken;
```

**Key Points**:

- Check authorization/validation
- Set request properties
- Call `next()` to continue
- Return error if validation fails
- Don't call res.json() and next() together

---

### Routes (`src/routes/`)

**Responsibility**: Define API endpoints and middleware order

**Pattern**:

```javascript
// routes/auth/users.routes.js
import express from "express";
import userCreatedController from "../../controllers/auth/userCreated.controller.js";
import checkInputan from "../../middleware/checkInputan.js";
import checkCookieUser from "../../middleware/checkCookieUser.js";

const router = express.Router();

// Public endpoint
router.post("/users/created", checkInputan, userCreatedController);

// Protected endpoint
router.get("/users/list", checkCookieUser, validasiRole, userListController);

export default router;
```

**Key Points**:

- Order middleware correctly (most restrictive last)
- Group related routes
- Use descriptive route names
- Export router as default

---

### Utils (`src/utils/`)

**Responsibility**: Reusable utility functions

**Examples**:

**Password Hashing** (`passwordHashing.js`):

```javascript
import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

export const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};
```

**UUID Generation** (`generateUUID.js`):

```javascript
import { v4 as uuidv4 } from "uuid";

export const generateUUID = () => {
  return uuidv4();
};
```

**Format Rupiah** (`changeFormatRp.js`):

```javascript
export const formatRupiah = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(amount);
};
```

---

## 🏗️ Architecture Pattern

The application follows **MVC (Model-View-Controller) + Service Layer** pattern:

```
Request → Route → Middleware → Controller → Service → Repository → Database
                                     ↓
                            Response ← Middleware (Error Handler)
```

**Flow Example**:

```
POST /api/users/created
  ↓
routes/auth/users.routes.js (route definition)
  ↓
middleware/checkInputan.js (validate input)
  ↓
controllers/auth/userCreated.controller.js (handle request)
  ↓
services/auth/useCreatedUser.service.js (business logic)
  ↓
config/db.config.js (database query)
  ↓
Response sent back to client
```

---

## 🔍 Code Examples

### Creating a New Feature

**Step 1: Create Database Table** (if needed)

```sql
-- migrations/XXX.createNewTable.sql
CREATE TABLE new_table (
  id VARCHAR(100) PRIMARY KEY,
  user_id VARCHAR(100),
  data TEXT,
  created DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(user_id)
);
```

**Step 2: Create Service**

```javascript
// services/feature/newFeature.service.js
export const createNewFeatureService = async (userId, data) => {
  const [result] = await db.query(
    "INSERT INTO new_table (id, user_id, data, created) VALUES (?, ?, ?, NOW())",
    [generateUUID(), userId, JSON.stringify(data)],
  );
  return result;
};
```

**Step 3: Create Controller**

```javascript
// controllers/feature/newFeature.controller.js
import { createNewFeatureService } from "../../services/feature/newFeature.service.js";

const newFeatureController = async (req, res, next) => {
  try {
    const { user_id } = req.user;
    const { data } = req.body;

    const result = await createNewFeatureService(user_id, data);

    return res.status(201).json({
      status: true,
      message: "Feature created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default newFeatureController;
```

**Step 4: Create Route**

```javascript
// routes/feature/feature.routes.js
import express from "express";
import newFeatureController from "../../controllers/feature/newFeature.controller.js";
import checkCookieUser from "../../middleware/checkCookieUser.js";

const router = express.Router();

router.post("/feature/create", checkCookieUser, newFeatureController);

export default router;
```

**Step 5: Register Route in app.js**

```javascript
import featureRoute from "./routes/feature/feature.routes.js";
app.use("/api", featureRoute);
```

---

## 🧪 Testing

### Unit Testing Example

**Setup**: Use Jest for testing

```bash
npm install --save-dev jest @types/jest
```

**Test File** (`testing/auth/register.test.js`):

```javascript
import {
  hashPassword,
  verifyPassword,
} from "../../src/utils/passwordHashing.js";

describe("Password Hashing", () => {
  test("should hash password correctly", async () => {
    const password = "TestPassword123!";
    const hash = await hashPassword(password);

    expect(hash).not.toBe(password);
    expect(hash.length).toBeGreaterThan(0);
  });

  test("should verify correct password", async () => {
    const password = "TestPassword123!";
    const hash = await hashPassword(password);
    const result = await verifyPassword(password, hash);

    expect(result).toBe(true);
  });

  test("should reject incorrect password", async () => {
    const password = "TestPassword123!";
    const hash = await hashPassword(password);
    const result = await verifyPassword("WrongPassword", hash);

    expect(result).toBe(false);
  });
});
```

**Run Tests**:

```bash
npm test
```

---

## 🐛 Error Handling

### Standard Error Response

```javascript
// In any controller
if (error.code === "ER_DUP_ENTRY") {
  return res.status(409).json({
    status: false,
    message: "Duplicate entry",
    error: "Email already exists",
  });
}

if (error.message.includes("No rows to UPDATE")) {
  return res.status(404).json({
    status: false,
    message: "Resource not found",
  });
}

// Generic error
return res.status(500).json({
  status: false,
  message: "Internal server error",
  error: process.env.NODE_ENV === "dev" ? error.message : undefined,
});
```

### Global Error Handler (app.js)

```javascript
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  if (process.env.NODE_ENV === "dev") {
    return res.status(status).json({
      status: false,
      message,
      error: err.message,
      stack: err.stack,
    });
  }

  return res.status(status).json({
    status: false,
    message,
    error: message,
  });
});
```

---

## 📝 Logging & Debugging

### Request Logging (Morgan)

```javascript
// app.js
import morgan from "morgan";

app.use(morgan("dev")); // Development format
// app.use(morgan("combined")); // Production format
```

### Custom Logging

```javascript
// utils/logger.js
export const logger = {
  info: (message) => console.log(`[INFO] ${message}`),
  error: (message) => console.error(`[ERROR] ${message}`),
  warn: (message) => console.warn(`[WARN] ${message}`),
  debug: (message) => {
    if (process.env.NODE_ENV === "dev") {
      console.log(`[DEBUG] ${message}`);
    }
  },
};
```

---

## 📚 API Documentation Best Practices

- Use JSDoc comments for functions
- Document request/response formats
- Include error codes and messages
- Provide curl/Postman examples
- Keep docs updated with code

**Example**:

```javascript
/**
 * Create new user
 * @param {string} email - User email
 * @param {string} username - User username
 * @param {string} password - User password (min 8 chars)
 * @returns {Promise<Object>} Created user object
 * @throws {Error} If email already exists
 *
 * @example
 * const user = await createUserService('email@test.com', 'username', 'password123');
 */
export const createUserService = async (email, username, password) => {
  // Implementation
};
```

---

## 🔐 Security Best Practices

1. **Input Validation**
   - Always validate input in middleware
   - Use parameterized queries to prevent SQL injection
   - Sanitize file uploads

2. **Authentication**
   - Use secure JWT secrets (min 32 characters)
   - Set token expiration times
   - Use HttpOnly cookies

3. **Password Security**
   - Hash passwords with bcrypt (salt rounds 10)
   - Enforce minimum password requirements
   - Never log passwords

4. **Database**
   - Use connection pooling
   - Implement rate limiting
   - Add query logging for debugging

5. **API Security**
   - Enable CORS restrictions
   - Use Helmet.js for security headers
   - Implement rate limiting
   - Add request validation

---

## 🚀 Performance Optimization

### Database Queries

```javascript
// Good: Use indexes
const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

// Bad: Full table scan
// SELECT * FROM users WHERE LOWER(email) = ?

// Good: Limit results
const [users] = await db.query("SELECT * FROM users LIMIT 10 OFFSET ?", [
  offset,
]);

// Good: Select only needed columns
const [users] = await db.query("SELECT user_id, email, username FROM users");
```

### Caching

```javascript
// Simple in-memory cache
const cache = new Map();

const getCachedUser = async (email) => {
  if (cache.has(email)) {
    return cache.get(email);
  }

  const user = await getUserFromDB(email);
  cache.set(email, user);
  return user;
};
```

### Connection Pooling

```javascript
// Already configured in db.config.js
// Connections are reused automatically
```

---

## 🔄 Git Workflow

### Branch Naming

```
feature/feature-name
bugfix/bug-description
hotfix/critical-issue
docs/documentation-updates
```

### Commit Messages

```
feat: Add new feature
fix: Fix bug
docs: Update documentation
refactor: Refactor code
test: Add tests
chore: Update dependencies
```

### Pull Request Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Feature
- [ ] Bug fix
- [ ] Documentation

## Testing

How to test the changes

## Screenshots (if applicable)
```

---

## 📋 Checklist for New Features

- [ ] Create database migration (if needed)
- [ ] Create service layer
- [ ] Create controller
- [ ] Create/update routes
- [ ] Add middleware (if needed)
- [ ] Add input validation
- [ ] Add error handling
- [ ] Write unit tests
- [ ] Update API documentation
- [ ] Update README if necessary
- [ ] Test with Postman/cURL
- [ ] Code review
- [ ] Merge to main branch

---

## 🆘 Troubleshooting

### Common Issues

**Database Connection Error**

```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

Solution: Check `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` in .env

**JWT Verification Failed**

```
Error: invalid token
```

Solution: Check JWT secret matches, token not expired

**CORS Error**

```
Access to XMLHttpRequest blocked by CORS policy
```

Solution: Update `CORS_ORIGIN` in .env to match frontend URL

**File Upload Error**

```
Error: File too large
```

Solution: Check file size limit in multer.config.js

---

**Last Updated**: February 27, 2026
