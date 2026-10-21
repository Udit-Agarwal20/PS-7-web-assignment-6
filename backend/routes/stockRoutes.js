const express = require("express");
const router = express.Router();
const {
  recordStockIn,
  recordStockOut,
  getProductMovements,
  getLowStockProducts,
} = require("../controllers/stockController");
const { auth } = require("../middleware/auth");

router.use(auth);

router.post("/in", recordStockIn);
router.post("/out", recordStockOut);
router.get("/movements/:productId", getProductMovements);
router.get("/low-stock", getLowStockProducts);

module.exports = router;
