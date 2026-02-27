# Quick Reference & Troubleshooting

## 📚 Quick Reference

### Common Commands

```bash
# Installation & Setup
npm install                    # Install dependencies
npm run dev                   # Start development server

# Database
mysql -u root -p < migration.sql    # Run migration
source ~/.bashrc                    # Reload bash config

# Node.js
node --version               # Check Node version
npm --version               # Check npm version
```

### File Locations

| File            | Location                             | Purpose                 |
| --------------- | ------------------------------------ | ----------------------- |
| Main App        | `src/app.js`                         | Express configuration   |
| Entry Point     | `src/local.js`                       | Dev server entry        |
| Database Config | `src/config/db.config.js`            | MySQL connection        |
| Email Config    | `src/config/nodeailer.config.js`     | Email setup             |
| File Upload     | `src/config/multer.config.js`        | Image upload            |
| User Routes     | `src/routes/auth/users.routes.js`    | Auth endpoints          |
| Product Routes  | `src/routes/produk/produk.routes.js` | Product endpoints       |
| Environment     | `.env`                               | Configuration variables |

---

## 🔗 API Endpoints Quick List

### Auth Endpoints

```
POST   /api/users/created              Register
POST   /api/users/login                Login
POST   /api/users/logout               Logout
PATCH  /api/users/edit                 Edit Profile
DELETE /api/users/delete               Delete Account
POST   /api/users/activate-code        Activate Account
POST   /api/users/admin/created        Create Admin
GET    /api/users/list                 Get All Users
```

### Product Endpoints

```
GET    /api/produks/list               Get All Products
POST   /api/produks/uploads            Upload Product
GET    /api/produks/searchProduks/:id  Search Product
PATCH  /api/produks/edit/:id           Edit Product
DELETE /api/produks/delete/:id         Delete Product
```

### Checkout Endpoints

```
POST   /api/client/checkouts           Create Checkout
```

### Transaction Endpoints

```
POST   /api/transaction/dana           Payment (Dana)
POST   /api/transaction/topup          Top Up
POST   /api/transaction/konfirmasi-pembayaran  Confirm Payment
```

### Health Endpoints

```
GET    /api/health                     Server Status
GET    /api/auth/health                Auth Service Status
```

---

## 🧩 Middleware Reference

| Middleware         | File                          | Purpose                              |
| ------------------ | ----------------------------- | ------------------------------------ |
| Check Token        | `checkToken.js`               | Verify JWT from Authorization header |
| Check Cookie       | `checkCookieUser.js`          | Verify JWT from cookies              |
| Input Validation   | `checkInputan.js`             | Validate user input                  |
| Product Validation | `produkCheckInputan.js`       | Validate product input               |
| Brute Force        | `checkBruteForce.js`          | Prevent brute force attacks          |
| Role Check         | `validasiRole.js`             | Admin-only access                    |
| Token Checkout     | `validasiTokenCheckout.js`    | Checkout authorization               |
| Auth Header        | `validationsAuthorization.js` | Validate Bearer token                |

---

## 🏗️ Directory Structure Reference

```
src/
├── app.js                    Main Express app
├── local.js                 Dev entry point
├── config/                  Configuration
│   ├── db.config.js
│   ├── multer.config.js
│   └── nodeailer.config.js
├── controllers/             Request handlers
│   ├── auth/
│   ├── checkout/
│   ├── produks/
│   └── transactions/
├── middleware/              Request processing
├── models/                  Data layer
│   ├── migrations/          SQL files
│   └── repo/                Data access
├── routes/                  API endpoints
├── services/                Business logic
└── utils/                   Helper functions
```

---

## ❌ Common Errors & Solutions

### 1. Database Connection Error

**Error Message**:

```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**Causes & Solutions**:
| Cause | Solution |
|-------|----------|
| MySQL not running | Start MySQL service: `systemctl start mysql` (Linux) or `mysql.server start` (Mac) |
| Wrong host | Check `DB_HOST` in `.env` |
| Wrong port | Verify `DB_PORT` (usually 3306) |
| Wrong credentials | Check `DB_USER` and `DB_PASSWORD` |
| Database not created | Run migrations: `mysql -u root -p < migration.sql` |

**Check Connection**:

```bash
# Test MySQL connection
mysql -h localhost -u root -p -e "SELECT 1;"

# Check if MySQL is running
ps aux | grep mysql
```

---

### 2. JWT Token Error

**Error Message**:

```
Error: invalid token
JsonWebTokenError: invalid signature
```

**Causes & Solutions**:
| Cause | Solution |
|-------|----------|
| Wrong secret | Ensure `JWT_SECRET` in `.env` matches token creation |
| Token expired | Token lifetime exceeded |
| Token corrupted | Token was modified |
| Missing Bearer prefix | Use format: `Authorization: Bearer <token>` |

**Debug JWT**:

```javascript
// In controller
import jwt from "jsonwebtoken";

const token = req.headers.authorization?.split(" ")[1];
console.log("Token:", token);

try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log("Decoded:", decoded);
} catch (error) {
  console.log("JWT Error:", error.message);
}
```

---

### 3. CORS Error

**Error Message**:

```
Access to XMLHttpRequest from origin 'http://localhost:3000'
has been blocked by CORS policy
```

**Solution**:
Update `.env`:

```env
CORS_ORIGIN=http://localhost:3000
```

Update `src/app.js`:

```javascript
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true, // Allow cookies
  }),
);
```

---

### 4. File Upload Error

**Error Message**:

```
Error: File too large
Error: Only image files are allowed
```

**Solutions**:

For file too large:

```javascript
// In multer.config.js
limits: {
  fileSize: 5 * 1024 * 1024; // 5MB - increase if needed
}
```

For invalid file type:

```javascript
// Only JPEG/PNG allowed
const allowedMimes = ["image/jpeg", "image/png"];

const fileFilter = (req, file, cb) => {
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG and PNG allowed"), false);
  }
};
```

---

### 5. Email Send Error

**Error Message**:

```
Error: Invalid login - 535 5.7.8 Username and password not accepted.
```

**Solutions**:

For Gmail:

1. Enable 2-Factor Authentication
2. Generate App-specific password
3. Use the 16-character password in `.env`
4. Don't use your regular Gmail password

**Test Email Configuration**:

```javascript
import transporter from "../config/nodeailer.config.js";

// Test email
await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: "test@example.com",
  subject: "Test",
  text: "Test email",
});
```

---

### 6. Middleware Not Working

**Symptoms**:

- Routes not protected
- Input validation skipped
- Role check bypassed

**Causes & Solutions**:
| Issue | Solution |
|-------|----------|
| Middleware not registered | Add to route: `router.post('/path', middleware, controller)` |
| Middleware in wrong order | Place most restrictive last |
| Middleware doesn't call `next()` | Add `next()` call after validation |
| res.json() called twice | Don't call both `res.json()` and `next()` |

**Test Middleware**:

```javascript
const testMiddleware = (req, res, next) => {
  console.log("Middleware called");
  next();
};

router.get("/test", testMiddleware, controller);
```

---

### 7. Duplicate Entry Error

**Error Message**:

```
Error: ER_DUP_ENTRY: Duplicate entry 'email@test.com' for key 'PRIMARY'
```

**Solution**:

```javascript
// In controller
if (error.code === "ER_DUP_ENTRY") {
  return res.status(409).json({
    status: false,
    message: "Email already registered",
  });
}
```

**Check Existing Data**:

```sql
-- Check duplicate emails
SELECT email, COUNT(*) FROM users GROUP BY email HAVING COUNT(*) > 1;

-- Delete duplicates (careful!)
DELETE FROM users WHERE email = 'duplicate@test.com' LIMIT 1;
```

---

## 🔍 Debugging Tips

### 1. Check Request Data

```javascript
// In controller
console.log("Request Headers:", req.headers);
console.log("Request Body:", req.body);
console.log("Query Params:", req.query);
console.log("URL Params:", req.params);
console.log("Cookies:", req.cookies);
```

### 2. Check Database Queries

```javascript
// Before query
console.log("Query:", "SELECT * FROM users WHERE email = ?");
console.log("Values:", [email]);

// Execute
const [rows] = await db.query(query, [email]);

// Check result
console.log("Result:", rows);
```

### 3. Use Postman Console

In Postman:

- View → Show Postman Console
- See all request/response details
- Debug authentication issues

### 4. Browser DevTools

```javascript
// In client-side code
fetch("/api/users/login", {
  method: "POST",
  credentials: "include", // Send cookies
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
})
  .then((res) => res.json())
  .then((data) => console.log("Response:", data))
  .catch((err) => console.error("Error:", err));
```

### 5. Node.js Debugging

```bash
# Run with debug output
DEBUG=* npm run dev

# Or use inspector
node --inspect src/local.js
# Then open chrome://inspect
```

---

## 📊 Performance Monitoring

### Check Database Connections

```sql
-- Show current connections
SHOW PROCESSLIST;

-- Show connection limit
SHOW VARIABLES LIKE 'max_connections';

-- Kill connection (if stuck)
KILL <processid>;
```

### Check API Response Time

```bash
# Using curl
time curl http://localhost:3000/api/health

# Using ab (Apache Bench)
ab -n 100 -c 10 http://localhost:3000/api/health
```

### Monitor Memory Usage

```bash
# Node.js memory info
node -e "console.log(process.memoryUsage())"
```

---

## 🔐 Security Checklist

Before production deployment, verify:

- [ ] Change `JWT_SECRET` to strong value
- [ ] Update `DB_PASSWORD` to secure password
- [ ] Set `NODE_ENV=production`
- [ ] Enable SSL/TLS for database
- [ ] Update `CORS_ORIGIN` to production domain
- [ ] Enable `secure: true` in cookies
- [ ] Remove debug logging
- [ ] Enable rate limiting
- [ ] Update email credentials
- [ ] Backup database encryption
- [ ] Enable HTTPS on frontend
- [ ] Add WAF (Web Application Firewall)
- [ ] Setup monitoring & alerts
- [ ] Document API changes

---

## 📞 Support Resources

### Internal Documentation

- `README.md` - Project overview
- `API_REFERENCE.md` - Complete API documentation
- `DATABASE_SCHEMA.md` - Database structure
- `CONFIGURATION.md` - Setup & configuration
- `DEVELOPMENT.md` - Development guide

### External Resources

- [Express.js Docs](https://expressjs.com/)
- [MySQL2 Docs](https://github.com/sidorares/node-mysql2)
- [JWT.io](https://jwt.io/)
- [Bcrypt.js](https://www.npmjs.com/package/bcrypt)
- [Multer](https://github.com/expressjs/multer)
- [NodeMailer](https://nodemailer.com/)

---

## 🎯 Quick Fix Commands

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# View running processes
lsof -i :3000

# Reset database
mysql -u root -p backend_porto < sql_reset_script.sql

# View environment variables
env | grep DB_

# Test SMTP connection
telnet smtp.gmail.com 587
```

---

## 💡 Pro Tips

1. **Use Postman Environment Variables**: Store JWT tokens in environment for easy testing
2. **Always Validate Input**: Never trust client data
3. **Check Logs Regularly**: Monitor error logs for issues
4. **Use Git Branches**: Develop features in separate branches
5. **Keep Dependencies Updated**: Regularly update packages: `npm update`
6. **Test Before Deploy**: Always test locally before pushing to production
7. **Document Changes**: Keep API docs updated when making changes
8. **Use Version Control**: Commit frequently with clear messages
9. **Monitor Resources**: Watch database connections and memory
10. **Have Backups**: Regular database backups are essential

---

**Last Updated**: February 27, 2026
