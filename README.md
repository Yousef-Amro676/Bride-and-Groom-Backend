# 💍 Bride & Groom — Backend API

> A complete, production-ready RESTful API for the **Bride & Groom** Flutter app.  
> Built with **Node.js · Express.js · MongoDB Atlas · Mongoose · JWT · bcrypt**

---

## 📁 Project Structure

```
Bride_and_Groom_BackEnd/
│
├── app.js                          ← Express app (middleware + routes)
├── server.js                       ← Entry point (DB + server start)
├── seed.js                         ← Database seeder with sample data
├── package.json
├── .env                            ← Environment secrets (never commit!)
├── .gitignore
├── BrideAndGroom.postman_collection.json  ← Import into Postman
│
├── config/
│   └── db.js                       ← MongoDB Atlas connection
│
├── models/
│   ├── User.js                     ← Users (bcrypt password hashing)
│   ├── Vendor.js                   ← Unified vendor (all categories)
│   ├── Booking.js                  ← User ↔ Vendor bookings
│   ├── Dress.js
│   ├── Photographer.js
│   ├── Planner.js
│   ├── Ring.js
│   └── Order.js
│
├── controllers/
│   ├── userController.js           ← Auth (JWT) + profile
│   ├── vendorController.js         ← CRUD + filtering/search/sort
│   ├── bookingController.js        ← Booking workflow
│   ├── dressController.js
│   ├── photographerController.js
│   ├── plannerController.js
│   ├── ringController.js
│   └── orderController.js
│
├── routes/
│   ├── userRoutes.js               ← With express-validator rules
│   ├── vendorRoutes.js
│   ├── bookingRoutes.js
│   ├── dressRoutes.js
│   ├── photographerRoutes.js
│   ├── plannerRoutes.js
│   ├── ringRoutes.js
│   └── orderRoutes.js
│
└── middleware/
    ├── authMiddleware.js            ← protect() + adminOnly()
    ├── validateMiddleware.js        ← express-validator collector
    └── errorHandler.js             ← Global error handler
```

---

## ⚙️ Setup

### 1 — Install Dependencies
```bash
npm install
```

### 2 — Configure `.env`
Open `.env` and replace the MongoDB URI:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/weddingDB
JWT_SECRET=BrideAndGroom_SuperSecret_JWT_Key_2024!
JWT_EXPIRES_IN=7d
```

### 3 — Seed Sample Data (optional)
```bash
node seed.js          # Adds admin user + 8 vendors
node seed.js --clear  # Wipes all data
```

### 4 — Start the Server
```bash
npm run dev     # Development (auto-restart with nodemon)
npm start       # Production
```

**Expected output:**
```
══════════════════════════════════════
  💍 Bride & Groom API
  🚀 Server: http://localhost:5000
  🌍 Mode:   development
══════════════════════════════════════

✅  MongoDB Connected: <your-cluster>.mongodb.net
```

---

## 🌐 API Reference

### 🔑 Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/users/signup` | Register new user | Public |
| POST | `/api/users/login` | Login (returns JWT) | Public |
| GET | `/api/users/profile/:id` | Get profile | 🔒 User |
| PUT | `/api/users/profile/:id` | Update profile | 🔒 User |
| GET | `/api/users` | All users | 🔒 Admin |
| DELETE | `/api/users/:id` | Delete user | 🔒 Admin |

### 🏪 Vendors

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/vendors` | List all (filterable) | Public |
| GET | `/api/vendors/:id` | Single vendor | Public |
| POST | `/api/vendors` | Create vendor | 🔒 Admin |
| PATCH | `/api/vendors/:id` | Update vendor | 🔒 Admin |
| DELETE | `/api/vendors/:id` | Delete vendor | 🔒 Admin |

### 📅 Bookings

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/bookings` | Create booking | 🔒 User |
| GET | `/api/bookings/my/:userId` | My bookings | 🔒 User |
| GET | `/api/bookings/:id` | Single booking | 🔒 User |
| GET | `/api/bookings` | All bookings | 🔒 Admin |
| PATCH | `/api/bookings/:id` | Update status | 🔒 Admin |
| DELETE | `/api/bookings/:id` | Cancel booking | 🔒 User |

---

## 🔍 Vendor Filtering

All filters can be combined in one request:

```
GET /api/vendors?category=photographer
GET /api/vendors?location=cairo
GET /api/vendors?minPrice=1000&maxPrice=5000
GET /api/vendors?search=ahmed
GET /api/vendors?available=true
GET /api/vendors?sort=price         ← Ascending
GET /api/vendors?sort=-price        ← Descending
GET /api/vendors?sort=-rating

# Combined example:
GET /api/vendors?category=photographer&location=cairo&maxPrice=5000&sort=price
```

---

## 🔐 Using JWT Authentication

After signup or login, you receive a token:
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Yousef",
    "email": "yousef@gmail.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR..."
  }
}
```

Send it in all protected requests:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR...
```

---

## 📦 Standard Response Format

**Success:**
```json
{ "success": true, "message": "...", "data": {} }
```

**Validation Error (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Please enter a valid email address" }
  ]
}
```

**Error (401 / 404 / 500):**
```json
{ "success": false, "message": "Error description here" }
```

---

## 📮 Postman Collection

Import `BrideAndGroom.postman_collection.json` into Postman.

Set collection variables:
- `base_url` → `http://localhost:5000`
- `auth_token` → paste JWT from login response
- `user_id`, `vendor_id`, `booking_id` → paste IDs from responses

---

## 📦 Packages Used

| Package | Purpose |
|---------|---------|
| `express` | HTTP server and routing |
| `mongoose` | MongoDB ODM |
| `dotenv` | Environment variables |
| `cors` | Cross-origin requests (Flutter) |
| `bcryptjs` | Password hashing |
| `jsonwebtoken` | JWT authentication |
| `express-validator` | Request validation |
| `nodemon` | Auto-restart in development |
