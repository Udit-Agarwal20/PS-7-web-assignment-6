const Product = require("../models/Product");
const Supplier = require("../models/Supplier");
const StockMovement = require("../models/StockMovement");

const recordStockIn = async (req, res, next) => {
  try {
    const { productId, supplierId, quantity, unitCost } = req.body;

    if (!productId || !supplierId || quantity === undefined || unitCost === undefined) {
      return res.status(400).json({
        message: "Please provide productId, supplierId, quantity, and unitCost",
      });
    }

    const numQty = Number(quantity);
    const numCost = Number(unitCost);

    if (isNaN(numQty) || numQty <= 0 || !Number.isInteger(numQty)) {
      return res.status(400).json({ message: "Quantity must be a positive integer" });
    }

    if (isNaN(numCost) || numCost < 0) {
      return res.status(400).json({ message: "Unit cost must be a non-negative number" });
    }

    const product = await Product.findOne({ _id: productId });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const supplier = await Supplier.findOne({ _id: supplierId });
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    product.currentStock += numQty;
    await product.save();

    const movement = new StockMovement({
      product: product._id,
      supplier: supplier._id,
      movementType: "IN",
      quantity: numQty,
      unitCost: numCost,
      recordedBy: req.user.userId,
      date: new Date(),
    });

    await movement.save();

    res.status(201).json({
      message: "Stock IN recorded successfully",
      product,
      movement,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid product or supplier ID format" });
    }
    next(error);
  }
};

const recordStockOut = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return res.status(400).json({
        message: "Please provide productId and quantity",
      });
    }

    const numQty = Number(quantity);
    if (isNaN(numQty) || numQty <= 0 || !Number.isInteger(numQty)) {
      return res.status(400).json({ message: "Quantity must be a positive integer" });
    }

    const product = await Product.findOne({ _id: productId });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.currentStock < numQty) {
      return res.status(400).json({
        message: `Insufficient stock. Available stock is ${product.currentStock}, but requested ${numQty}.`,
      });
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productId, currentStock: { $gte: numQty } },
      { $inc: { currentStock: -numQty } },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(400).json({
        message: "Insufficient stock available. Stock update was declined.",
      });
    }

    const movement = new StockMovement({
      product: updatedProduct._id,
      movementType: "OUT",
      quantity: numQty,
      unitCost: updatedProduct.costPrice,
      unitSellingPrice: updatedProduct.sellingPrice,
      recordedBy: req.user.userId,
      date: new Date(),
    });

    await movement.save();

    res.status(201).json({
      message: "Stock OUT recorded successfully",
      product: updatedProduct,
      movement,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid product ID format" });
    }
    next(error);
  }
};

const getProductMovements = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await Product.findOne({ _id: productId });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const movements = await StockMovement.find({ product: productId })
      .populate("supplier", "name phone city")
      .populate("recordedBy", "name email")
      .sort({ date: -1 });

    res.status(200).json({ movements });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Product not found" });
    }
    next(error);
  }
};

const getLowStockProducts = async (req, res, next) => {
  try {
    const allProducts = await Product.find({}).sort({ currentStock: 1 });
    const lowStock = allProducts.filter(
      (product) => product.currentStock <= product.reorderLevel
    );

    res.status(200).json({ products: lowStock });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  recordStockIn,
  recordStockOut,
  getProductMovements,
  getLowStockProducts,
};
