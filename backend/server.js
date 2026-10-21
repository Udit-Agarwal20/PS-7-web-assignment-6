const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(express.json());

const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
const allowedOrigins = [
  clientUrl,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://ps7-inventory-frontend-udit-agarwal20s-projects.vercel.app",
  "https://frontend-opal-xi-27lpd0w0vx.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

const { connectDB, isDbConnected } = require("./config/db");

app.get("/api/health", (req, res) => {
  res.json({
    message: "Shop Inventory API is running",
    database: isDbConnected() ? "connected" : "disconnected",
  });
});

const checkDatabase = (req, res, next) => {
  if (!isDbConnected()) {
    return res.status(503).json({
      error: "Database unavailable",
      message: "Database is currently operating in offline/disabled mode. MongoDB Atlas connection is not active.",
    });
  }
  next();
};

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const stockRoutes = require("./routes/stockRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const errorHandler = require("./middleware/errorHandler");

app.use("/api/auth", checkDatabase, authRoutes);
app.use("/api/products", checkDatabase, productRoutes);
app.use("/api/suppliers", checkDatabase, supplierRoutes);
app.use("/api/stock", checkDatabase, stockRoutes);
app.use("/api/dashboard", checkDatabase, dashboardRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const HOST = process.env.NODE_ENV === "production" ? "0.0.0.0" : (process.env.HOST || "127.0.0.1");

if (require.main === module) {
  connectDB().finally(() => {
    app.listen(PORT, HOST, () => {
      console.log(`Server is running at http://${HOST}:${PORT}`);
    });
  });
}

module.exports = app;
