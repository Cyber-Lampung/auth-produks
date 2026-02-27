# 🔧 Prioritized Fixes & Action Plan

## 📊 Quick Summary

| Priority    | Category        | Count        | Est. Time     |
| ----------- | --------------- | ------------ | ------------- |
| 🔴 CRITICAL | Security & Bugs | 8            | 2-3 days      |
| 🟠 HIGH     | Code Quality    | 7            | 3-4 days      |
| 🟡 MEDIUM   | Best Practices  | 6            | 2-3 days      |
| 🟢 LOW      | Optimization    | 5            | 3-5 days      |
| **TOTAL**   |                 | **26 fixes** | **1-2 weeks** |

---

## 🔴 CRITICAL PRIORITY (Do First!)

### 1. **Fix Input Validation** ⚠️ SECURITY RISK

**File**: `src/middleware/checkInputan.js`  
**Severity**: HIGH - SQL Injection & XSS risk  
**Time**: 2 hours

**Current Issue**:

```javascript
const regextText = /%-`!#-=/; // ❌ This doesn't prevent SQL injection!
```

**Fix**:

```javascript
// Use proper email validation
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  return res.status(400).json({ status: false, message: "Invalid email" });
}

// Validate password strength
if (password.length < 8) {
  return res.status(400).json({ status: false, message: "Password too weak" });
}

// Validate username format
if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
  return res.status(400).json({ status: false, message: "Invalid username" });
}
```

**Checklist**:

- [ ] Remove invalid regex
- [ ] Add proper email validation
- [ ] Add password strength check
- [ ] Add username format validation
- [ ] Test with edge cases (empty, special chars, etc.)

---

### 2. **Fix Middleware Return Values** ⚠️ BREAKS REQUESTS

**File**: `src/middleware/checkCookieUser.js`  
**Severity**: CRITICAL - Middleware won't work  
**Time**: 1 hour

**Current Issue**:

```javascript
if (!refreshToken) {
  return { status: false, message: "..." }; // ❌ Returns object, not HTTP response!
}
```

**Fix**:

```javascript
if (!refreshToken) {
  return res.status(401).json({ status: false, message: "Token not found" });
}
```

**Checklist**:

- [ ] Change return to res.status().json()
- [ ] Test to ensure middleware properly blocks requests

---

### 3. **Fix Cookie Security** 🔒 SECURITY RISK

**Files**:

- `src/controllers/auth/userCreated.controller.js`
- `src/controllers/auth/userLogin.controller.js`

**Severity**: HIGH - Insecure cookie settings  
**Time**: 1 hour

**Current Issue**:

```javascript
secure: false,    // Development only! But in production ...
sameSite: "lax"   // Should be "strict"
```

**Fix**:

```javascript
const isProduction = process.env.NODE_ENV === "production";

res.cookie("accessToken", token, {
  httpOnly: true,
  secure: isProduction, // true only in production
  sameSite: isProduction ? "strict" : "lax",
  maxAge: 15 * 60 * 1000,
  path: "/",
});
```

**Checklist**:

- [ ] Set secure based on NODE_ENV
- [ ] Set sameSite to "strict" for production
- [ ] Keep consistent across both login and register
- [ ] Test in dev and production environments

---

### 4. **Fix Token Middleware Bugs** 🐛 CRITICAL BUGS

**File**: `src/middleware/checkToken.js`  
**Severity**: CRITICAL  
**Time**: 1 hour

**Current Issues**:

```javascript
// ❌ Issues:
// 1. Empty string line: ("");
// 2. Debug console.log left in code
// 3. Unreachable code (next() before return)
// 4. No actual JWT verification
```

**Fix**:

```javascript
export default function checkToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      status: false,
      message: "Invalid authorization header",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      status: false,
      message: "Token not found",
    });
  }

  // Add actual JWT verification here
  try {
    // const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
    // req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      status: false,
      message: "Invalid token",
    });
  }
}
```

**Checklist**:

- [ ] Remove empty string line
- [ ] Remove console.log
- [ ] Fix unreachable code
- [ ] Add JWT verification
- [ ] Test with valid/invalid tokens

---

### 5. **Fix Typos & Naming** 📝 CODE QUALITY

**Files**: Multiple  
**Severity**: MEDIUM - Affects readability  
**Time**: 2 hours

**Current Issues**:

```javascript
// ❌ Typos:
useSeviceCreatedUser    // Should be: useServiceCreatedUser
checkInputan            // Indonesian, should be: validateInput

// ❌ Inconsistent:
const { passwordHash } = await passwordHashing(password);
// passwordHashing is function, passwordHash is wrong variable name

// ❌ Wrong pattern:
async function checkInputan(req, res, next) {
// Should be regular function, not async (doesn't use await)
```

**Fix Mapping**:
| Current | Should Be |
|---------|-----------|
| useSeviceCreatedUser | useServiceCreatedUser |
| checkInputan | validateInput |
| checkCookieUser | verifyUserCookie |
| produkCheckInputan | validateProductInput |
| produkUploadController | productUploadController |
| resService | response / result |
| resAccessToken | accessToken |

**Checklist**:

- [ ] Find & replace all typos
- [ ] Ensure all code is English (no Indonesia terms)
- [ ] Remove async from functions that don't need it
- [ ] Test after refactoring (using IDE refactor tools)

---

### 6. **Remove Debug Code** 🧹 CODE CLEANUP

**File**: `src/middleware/checkToken.js`  
**Severity**: LOW-MEDIUM  
**Time**: 30 minutes

**Current Issue**:

```javascript
console.log(tokenHeader); // ❌ Debug code left in production
(""); // ❌ Empty string statement
err.stack; // ❌ No-op statement
```

**Fix**: Remove all debug code

**Checklist**:

- [ ] Remove all console.log statements
- [ ] Remove empty statements
- [ ] Remove no-op statements
- [ ] Keep only meaningful logs (if any)

---

### 7. **Add Rate Limiting** 🔒 SECURITY FEATURE

**File**: `src/routes/auth/users.routes.js`  
**Severity**: HIGH - Brute force vulnerability  
**Time**: 2 hours

**Install**:

```bash
npm install express-rate-limit
```

**Implement**:

```javascript
import rateLimit from "express-rate-limit";

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: "Too many login attempts, please try again later",
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 requests per window
  message: "Too many registrations, please try again later",
});

router.post("/users/login", loginLimiter, checkInputan, userLoginController);
router.post(
  "/users/created",
  registerLimiter,
  checkInputan,
  userCreatedController,
);
```

**Checklist**:

- [ ] Install rate-limit package
- [ ] Apply to login endpoint
- [ ] Apply to register endpoint
- [ ] Test with repeated requests

---

### 8. **Verify Database Queries Are Parameterized** 🗄️ SQL INJECTION

**Files**: All repository files  
**Severity**: CRITICAL  
**Time**: 2 hours

**To Check**: Read all files in `src/models/repo/` and verify:

**✅ CORRECT**:

```javascript
const [result] = await db.query(
  "SELECT * FROM users WHERE email = ?",
  [email], // Parameter passed separately
);
```

**❌ WRONG (VULNERABLE)**:

```javascript
const query = `SELECT * FROM users WHERE email = '${email}'`;
// Never use string interpolation!
```

**Checklist**:

- [ ] Review all SQL queries in repo files
- [ ] Ensure all use parameterized queries (?)
- [ ] No string interpolation in queries
- [ ] Update any vulnerable queries

---

## 🟠 HIGH PRIORITY (Do Second)

### 9. **Fix Async/Await Misuse**

**Time**: 1 hour

```javascript
// ❌ CURRENT
export default async function generateUUID() {
  const uuid = uuidV4();  // uuidV4() is NOT async!
  return uuid;
}

// ✅ FIXED
export default function generateUUID() {
  return uuidV4();
}
```

**Checklist**:

- [ ] Remove async from synchronous functions
- [ ] Verify functions with await actually have async
- [ ] Test functions still work

---

### 10. **Add Error Handling for All Cases**

**Time**: 2 hours

Example from `userCreated.controller.js`:

```javascript
// ❌ CURRENT - No handling if status is false
if (resService.status) {
  // ... return success
}
// What if false? No error response!

// ✅ FIXED
if (resService.status) {
  // ... return success
  return res.status(201).json({...});
} else {
  return res.status(400).json({
    status: false,
    message: resService.message || "Failed to create user"
  });
}
```

**Checklist**:

- [ ] Add else clause for all if statements
- [ ] Return appropriate error responses
- [ ] Ensure all code paths return something

---

### 11. **Use Consistent Cookie Settings**

**Time**: 1 hour

Current: accessToken has `secure: false`, refreshToken has `secure: true`

**Fix**: Make them consistent:

```javascript
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  path: "/",
};

res.cookie("accessToken", token, {
  ...COOKIE_OPTIONS,
  maxAge: 15 * 60 * 1000,
});

res.cookie("refreshToken", token, {
  ...COOKIE_OPTIONS,
  maxAge: 7 * 24 * 60 * 60 * 1000,
});
```

**Checklist**:

- [ ] Create COOKIE_OPTIONS constant
- [ ] Use in both login and register
- [ ] Test both endpoints

---

### 12. **Add Magic Number Constants**

**Time**: 1 hour

```javascript
// ❌ CURRENT
maxAge: 15 * 60 * 1000;
maxAge: 7 * 24 * 60 * 60 * 1000;

// ✅ FIXED
const ACCESS_TOKEN_EXPIRY = 15 * 60 * 1000; // 15 minutes
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

// Use them:
maxAge: ACCESS_TOKEN_EXPIRY;
maxAge: REFRESH_TOKEN_EXPIRY;
```

**Checklist**:

- [ ] Create constants for all magic numbers
- [ ] Document what each constant means
- [ ] Use constants consistently

---

### 13. **Add JSDoc Comments**

**Time**: 3 hours

Example:

```javascript
/**
 * Handle user registration request
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.email - User email address
 * @param {string} req.body.username - User username (3-20 chars)
 * @param {string} req.body.password - User password (min 8 chars)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 * @throws {Error} If user creation fails
 * @example
 * // Usage:
 * POST /api/users/created
 * Body: { email: "user@test.com", username: "john", password: "pass123456" }
 */
export default async function userCreatedController(req, res, next) {
  // ...
}
```

**Checklist**:

- [ ] Add JSDoc to all controllers
- [ ] Add JSDoc to all services
- [ ] Add JSDoc to all middleware
- [ ] Add JSDoc to all utilities

---

---

## 🟡 MEDIUM PRIORITY (Do Third)

### 14. **Add Pagination to List Endpoints**

**Time**: 2 hours

```javascript
// ✅ IMPLEMENT
GET /api/users/list?page=1&limit=10

// Response:
{
  status: true,
  data: [...users],
  pagination: {
    page: 1,
    limit: 10,
    total: 150,
    pages: 15
  }
}
```

---

### 15. **Add Search/Filter Support**

**Time**: 2 hours

```javascript
// ✅ IMPLEMENT
GET /api/produks/list?search=laptop&minPrice=1000000&category=electronics
```

---

### 16. **Add API Versioning**

**Time**: 1 hour

```javascript
// ✅ IMPLEMENT
GET / api / v1 / users / list;
GET / api / v1 / produks / list;
```

---

### 17. **Improve Error Response Format**

**Time**: 2 hours

```javascript
// ✅ ADD validation errors details
{
  status: false,
  message: "Validation failed",
  errors: {
    email: ["Invalid email format", "Email already exists"],
    password: ["Must be minimum 8 characters"]
  }
}
```

---

### 18. **Database: Add Timestamps to All Tables**

**Time**: 1 hour

```sql
ALTER TABLE users ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
ALTER TABLE produks ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
ALTER TABLE sessions ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
-- etc for all tables
```

---

### 19. **Implement Soft Deletes**

**Time**: 1.5 hours

```sql
ALTER TABLE users ADD COLUMN deleted_at DATETIME;

-- Update queries:
SELECT * FROM users WHERE deleted_at IS NULL;
UPDATE users SET deleted_at = NOW() WHERE user_id = ?;
```

---

## 🟢 LOW PRIORITY (Nice to Have)

### 20-26. **Testing & Performance**

- [ ] Write unit tests (10+ tests)
- [ ] Write integration tests (5+ tests)
- [ ] Add query optimization (JOIN queries)
- [ ] Add caching strategy
- [ ] Setup ESLint
- [ ] Setup Prettier
- [ ] Add pre-commit hooks

---

## ⏱️ Implementation Timeline

### Week 1: Critical Issues (Days 1-3)

```
Day 1:
  - Fix input validation
  - Fix middleware return values
  - Fix cookie security
  - Fix token middleware bugs

Day 2:
  - Fix typos & naming (using IDE refactor)
  - Remove debug code
  - Verify parameterized queries

Day 3:
  - Add rate limiting
  - Test all critical fixes
  - Fix async/await misuse
```

### Week 1: High Issues (Days 4-5)

```
Day 4:
  - Add error handling
  - Fix cookie consistency
  - Add magic number constants

Day 5:
  - Add JSDoc comments
  - Test everything together
```

### Week 2: Medium Issues (Optional, during internship learning)

```
Days 6-7:
  - Add pagination
  - Add search/filter
  - Add database improvements
```

---

## 🎯 Testing Each Fix

### Fix Validation Checklist Template

```
[ ] Code change made
[ ] No syntax errors
[ ] Tested locally
[ ] Edge cases handled
[ ] Documentation updated (JSDoc)
[ ] Git commit made
[ ] All tests pass
```

---

## 📋 Batch Fix Commands (Optional)

Using VS Code Find & Replace:

```
Find & Replace all typos:
Find: useSeviceCreatedUser
Replace: useServiceCreatedUser

Find: checkInputan
Replace: validateInput

// etc.
```

---

## ✅ Completion Checklist

When you've completed ALL fixes, verify:

- [ ] No TypeErrors or syntax errors
- [ ] All endpoints respond with proper status codes
- [ ] All error cases have error responses
- [ ] No console.log in production code
- [ ] All JSDoc comments added
- [ ] All security issues fixed
- [ ] Database queries parameterized
- [ ] Cookies secure in production
- [ ] Rate limiting implemented
- [ ] Tests pass successfully
- [ ] Code reviewed by peer (if possible)

---

## 📞 Need Help?

If stuck on any fix:

1. Check the CODE_REVIEW.md file for detailed explanations
2. Check the DEVELOPMENT.md for patterns and best practices
3. Reference the API_REFERENCE.md for endpoint details
4. Ask for guidance during internship onboarding

---

**You got this! 💪 Focus on critical issues first, then gradually improve.**
