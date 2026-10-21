const Product = require("../models/Product");
const StockMovement = require("../models/StockMovement");

const getDashboardStats = async (req, res, next) => {
  try {
    const products = await Product.find({});
    const totalProducts = products.length;

    let totalStockValue = 0;
    let lowStockCount = 0;

    for (const p of products) {
      const stock = p.currentStock || 0;
      const cost = p.costPrice || 0;
      const reorder = p.reorderLevel !== undefined ? p.reorderLevel : 5;

      totalStockValue += stock * cost;
      if (stock <= reorder) {
        lowStockCount += 1;
      }
    }

    const now = new Date();
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const todayStr = formatter.format(now);

    const startOfToday = new Date(`${todayStr}T00:00:00+05:30`);
    const endOfToday = new Date(`${todayStr}T23:59:59.999+05:30`);

    const todayOutMovements = await StockMovement.find({
      movementType: "OUT",
      date: { $gte: startOfToday, $lte: endOfToday },
    });

    let todaySales = 0;
    let todayProfit = 0;

    for (const m of todayOutMovements) {
      const qty = m.quantity || 0;
      const selling = m.unitSellingPrice || 0;
      const cost = m.unitCost || 0;

      todaySales += qty * selling;
      todayProfit += qty * (selling - cost);
    }

    res.status(200).json({
      stats: {
        totalProducts,
        totalStockValue: Math.round(totalStockValue * 100) / 100,
        lowStockCount,
        todaySales: Math.round(todaySales * 100) / 100,
        todayProfit: Math.round(todayProfit * 100) / 100,
        reportingDate: todayStr,
        timezone: "Asia/Kolkata",
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
};
