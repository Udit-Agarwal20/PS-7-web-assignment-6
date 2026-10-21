# Shop Inventory & Stock Management System (PS7)

A full-stack MERN application for managing retail shop inventory, product catalogs, supplier purchases (Stock IN), customer sales (Stock OUT), low-stock reorder alerts, and executive store performance analytics.

Built for **Assignment 6 — Problem Statement 7 (PS7)** using beginner-friendly MERN techniques modeled after classroom demonstrations.

---

## 1. Project Overview & Problem Statement

Retail store owners and shop staff face recurring inventory challenges: stockouts during peak hours, unrecorded stock losses, manual price calculation errors, and lost visibility into purchase vs. selling margins. 

The **Shop Inventory & Stock Management System** solves these operational problems by providing:
- **Centralized Product Catalog**: Track SKU, category, unit, cost price, selling price, and reorder levels.
- **Role-Based Access Control**: Admins manage products, prices, and suppliers; Staff can view inventory and record stock movements.
- **Dual Stock Movement Engine**:
  - **Stock IN (Purchases)**: Receive wholesale goods from registered suppliers, incrementing physical stock.
  - **Stock OUT (Sales)**: Deduct retail units sold, strictly preventing negative stock and capturing transaction-time prices.
- **Historical Profit Integrity**: Sale-time selling price and unit cost are preserved at the exact moment of sale so later supplier price fluctuations do not corrupt past profit reports.
- **Automated Low-Stock Monitoring**: Real-time alerts when current stock falls at or below designated reorder thresholds.
- **Executive Store Dashboard**: Immediate computation of total products, total inventory asset valuation, low-stock count, today's sales revenue, and today's gross profit in the shop's local timezone (`Asia/Kolkata`).

---

## 2. Technology Stack

- **Frontend**: React 18 (Vite, client-side rendering), React Router (`react-router-dom`), Plain CSS.
- **Backend**: Node.js, Express.js (RESTful JSON API architecture).
- **Database**: MongoDB Atlas cloud cluster with Mongoose Object Data Modeling (ODM).
- **Authentication**: JWT (JSON Web Tokens) with 1-day expiration and password hashing via `bcrypt` (salt rounds = 10).
- **Architecture**: Beginner-friendly CommonJS backend (`require`, `module.exports`, `async/await`, plain functions) and React functional components with `useState` and `useEffect`.

---

## 3. User Roles & Permissions

The system enforces strict Role-Based Access Control (RBAC) on the backend using JWT verification and role authorization middleware:

| Feature / Action | Staff Role | Admin Role | Backend Enforcement |
| :--- | :---: | :---: | :--- |
| View Product Catalog & Details | Yes | Yes | `auth` |
| View Stock Movement History | Yes | Yes | `auth` |
| View Low Stock Alert List | Yes | Yes | `auth` |
| Record Stock IN (Purchases) | Yes | Yes | `auth` |
| Record Stock OUT (Sales) | Yes | Yes | `auth` |
| Create New Products | No | Yes | `auth, authorizeRoles("admin")` |
| Edit Product Details & Prices | No | Yes | `auth, authorizeRoles("admin")` |
| Delete Products | No | Yes | `auth, authorizeRoles("admin")` + Audit Guard |
| Manage Suppliers (Add/Edit/Delete) | No | Yes | `auth, authorizeRoles("admin")` |
| View Executive Analytics Dashboard | No | Yes | `auth, authorizeRoles("admin")` |

> **Security Note**: Public registration automatically assigns the `staff` role. Admin accounts cannot self-register; they are designated through controlled database administrative configuration in MongoDB Compass.

---

## 4. Project Directory Structure

```text
shop-inventory/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB Atlas connection with fail-fast startup
│   ├── controllers/
│   │   ├── authController.js     # Register, login, getMe profile
│   │   ├── productController.js  # Product CRUD operations
│   │   ├── supplierController.js # Supplier CRUD operations
│   │   ├── stockController.js    # Stock IN, Stock OUT, movement history, low stock
│   │   └── dashboardController.js# Total stock value, sales, profit calculations
│   ├── middleware/
│   │   ├── auth.js               # JWT verification & role authorization
│   │   └── errorHandler.js       # Centralized JSON error handling
│   ├── models/
│   │   ├── User.js               # User schema (name, email, password, role)
│   │   ├── Product.js            # Product schema (sku, name, prices, stocks)
│   │   ├── Supplier.js           # Supplier schema (name, phone, city)
│   │   └── StockMovement.js      # Audit trail schema (IN/OUT, quantities, prices)
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth routes
│   │   ├── productRoutes.js      # /api/products routes
│   │   ├── supplierRoutes.js     # /api/suppliers routes
│   │   ├── stockRoutes.js        # /api/stock routes
│   │   └── dashboardRoutes.js    # /api/dashboard routes
│   ├── seed.js                   # 10 realistic retail products seeder script
│   ├── server.js                 # Express server & route mounter
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
└── frontend/
    ├── src/
    │   ├── api/
    │   │   ├── authApi.js        # Auth fetch client
    │   │   ├── productApi.js     # Product fetch client
    │   │   ├── supplierApi.js    # Supplier fetch client
    │   │   ├── stockApi.js       # Stock movement fetch client
    │   │   └── dashboardApi.js   # Dashboard metrics fetch client
    │   ├── components/
    │   │   ├── Navbar.jsx        # Role-aware sticky navigation bar
    │   │   ├── ProtectedRoute.jsx# Client-side route protection
    │   │   └── ProductForm.jsx   # Shared form for Add and Edit pages
    │   ├── pages/
    │   │   ├── Login.jsx         # Sign-in page
    │   │   ├── Register.jsx      # Staff registration page
    │   │   ├── Products.jsx      # Catalog with search and category filtering
    │   │   ├── ProductDetails.jsx# Details & complete movement audit table
    │   │   ├── AddProduct.jsx    # Admin product creation
    │   │   ├── EditProduct.jsx   # Admin product editing
    │   │   ├── StockIn.jsx       # Record supplier stock receipts
    │   │   ├── StockOut.jsx      # Record customer sales
    │   │   ├── LowStock.jsx      # Reorder alert table
    │   │   ├── Suppliers.jsx     # Admin supplier management
    │   │   ├── Dashboard.jsx     # Executive KPI cards (Admin only)
    │   │   └── NotFound.jsx      # 404 wildcard route
    │   ├── App.jsx               # Routes definition & auth state in localStorage
    │   ├── App.css               # Clean, responsive plain CSS stylesheet
    │   ├── index.css             # Base reset & typography
    │   └── main.jsx              # BrowserRouter root mount
    ├── index.html
    ├── vercel.json               # SPA client-side rewrite configuration
    ├── package.json
    └── .env.example
```

---

## 5. API Endpoint Summary

All API endpoints return JSON only (`res.json(...)`) and are mounted under `/api`.

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new staff user (bcrypt hashed, default role `staff`) |
| `POST` | `/api/auth/login` | Public | Verify credentials and receive 1-day JWT token |
| `GET` | `/api/auth/me` | Private (All) | Get current user profile (sanitized, no password) |

### Products (`/api/products`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Private (All) | List all products sorted by newest first |
| `GET` | `/api/products/:id` | Private (All) | Get single product details |
| `POST` | `/api/products` | Private (Admin) | Create product (unique SKU, sets initial stock) |
| `PUT` | `/api/products/:id` | Private (Admin) | Update permitted fields (stock editing blocked) |
| `DELETE`| `/api/products/:id` | Private (Admin) | Delete product (blocked if stock history exists) |

### Suppliers (`/api/suppliers`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/suppliers` | Private (All) | List all approved suppliers |
| `POST` | `/api/suppliers` | Private (Admin) | Add a new supplier |
| `PUT` | `/api/suppliers/:id` | Private (Admin) | Update supplier details |
| `DELETE`| `/api/suppliers/:id` | Private (Admin) | Delete supplier (blocked if referenced in history) |

### Stock Operations (`/api/stock`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/stock/in` | Private (All) | Record purchase, increment stock, save movement |
| `POST` | `/api/stock/out` | Private (All) | Record sale, decrement stock, save sale-time prices |
| `GET` | `/api/stock/movements/:productId` | Private (All) | Audit trail of all movements for a product |
| `GET` | `/api/stock/low-stock` | Private (All) | Products where `currentStock <= reorderLevel` |

### Dashboard (`/api/dashboard`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/dashboard/stats` | Private (Admin) | Real-time calculations: total products, total stock valuation, low-stock count, today's sales revenue, and today's profit (Asia/Kolkata timezone) |

---

## 6. Environment Variables Setup

### Backend (`shop-inventory/backend/.env`)
Create a `.env` file inside `backend/`:
```env
PORT=5000
HOST=127.0.0.1
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/shop_inventory?retryWrites=true&w=majority
JWT_SECRET=your_secure_jwt_secret_key_here
```
> Note: On local macOS, `HOST=127.0.0.1` prevents conflicts with macOS AirPlay Receiver listening on port 5000. In production (Render), the backend binds to `0.0.0.0`.

### Frontend (`shop-inventory/frontend/.env`)
Create a `.env` file inside `frontend/`:
```env
VITE_API_URL=http://127.0.0.1:5000/api
```

---

## 7. Installation & Local Startup

### Prerequisites
- Node.js (v18 or v20 recommended)
- npm
- MongoDB Atlas cluster account

### Step 1: Clone & Install Dependencies

```bash
# Clone the repository
git clone <your-github-repo-url>
cd assignment6-ps7/shop-inventory

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Configure MongoDB Atlas Network Access
1. Open [MongoDB Atlas](https://cloud.mongodb.com).
2. Go to **Security** → **Network Access**.
3. Ensure your current public IP address is on the IP Access List (or add `0.0.0.0/0` for development).

### Step 3: Run Database Seeder (Optional)
To populate the database with 10 realistic retail products and approved suppliers:
```bash
cd backend
node seed.js
```

### Step 4: Start the Application

Terminal 1 (Backend):
```bash
cd backend
npm start
# Server runs at http://127.0.0.1:5000
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
# Frontend runs at http://localhost:5173
```

---

## 8. Setting Up Demo Accounts

1. Start both servers and open `http://localhost:5173`.
2. Click **Register** and create a staff account:
   - Name: `Aman Staff`
   - Email: `aman@store.com`
   - Password: `password123`
3. To promote this user (or another demo user) to **Admin**:
   - Open **MongoDB Compass** and connect to your cluster.
   - Select database **`shop_inventory`** → collection **`users`**.
   - Locate the user record and edit `"role": "staff"` to `"role": "admin"`.
   - Click **Update**.
4. Log in at `http://localhost:5173/login` using the updated account. You will receive an admin JWT token unlocking all admin tabs (Add Product, Suppliers, Dashboard).

---

## 9. Deployment Guidelines

### Backend on Render
1. Create a new **Web Service** connected to your repository.
2. Root Directory: `shop-inventory/backend`
3. Build Command: `npm install`
4. Start Command: `node server.js`
5. Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: (Auto-assigned by Render)
   - `MONGO_URI`: `mongodb+srv://...`
   - `JWT_SECRET`: `<secure-random-string>`
   - `CLIENT_URL`: `https://<your-vercel-frontend-domain>.vercel.app`

### Frontend on Vercel
1. Create a new project on Vercel importing your repository.
2. Root Directory: `shop-inventory/frontend`
3. Framework Preset: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Environment Variables:
   - `VITE_API_URL`: `https://<your-render-backend-domain>.onrender.com/api`
7. SPA client-side routing is handled automatically via [`vercel.json`](./frontend/vercel.json).

---

## 10. Live Deployments & Demo Video Links

- **Live Application URL**: `[PENDING DEPLOYMENT]` *(Add live Vercel link here)*
- **Live Backend API**: `[PENDING DEPLOYMENT]` *(Add live Render link here)*
- **Project Presentation (Google Drive)**: `[PENDING UPLOAD]` *(Add PPT Drive link here)*
- **YouTube Demonstration Video**: `[PENDING PUBLISHING]` *(Add YouTube showcase video link here)*

---

## 11. Application Screenshots

| Screen | Description |
| :--- | :--- |
| *Product Inventory Catalog* | `[Screenshot: Products page with search, category filter, and stock levels]` |
| *Product Details & History* | `[Screenshot: Details page with audit table of purchases and sales]` |
| *Stock IN Transaction* | `[Screenshot: Stock IN form selecting product, supplier, and quantities]` |
| *Stock OUT Transaction* | `[Screenshot: Stock OUT form showing current stock and sale deduction]` |
| *Low Stock Alert Table* | `[Screenshot: Low stock warning page highlighting items below reorder level]` |
| *Executive Dashboard* | `[Screenshot: Admin KPI metrics showing total products, stock valuation, sales, profit]` |

---

## 12. Academic Integrity & Classroom Source Attribution

This project is an individual academic submission for **Assignment 6 (PS7)**. All code was written from scratch adhering to the design patterns and concepts demonstrated in class:
- Express setup and parameters: `Lect-12-nodejs`
- CORS configuration: `Lect-14-nodejs`
- JWT & Role authorization: `Lect-17-jwt-rollbased`
- React state & UI fetching: `Lect-25`, `Lect-27`
- Search & category filtering: `Lect-28-project`
- React Router dynamic routing: `Lect-29-react-roter`
