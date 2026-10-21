const Product = require("../models/Product");
const StockMovement = require("../models/StockMovement");

const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.status(200).json({ products });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ _id: id });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ product });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Product not found" });
    }
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const {
      sku,
      name,
      category,
      unit,
      costPrice,
      sellingPrice,
      openingStock,
      reorderLevel,
    } = req.body;

    if (
      !sku ||
      !name ||
      !category ||
      costPrice === undefined ||
      sellingPrice === undefined ||
      openingStock === undefined
    ) {
      return res.status(400).json({
        message: "Please provide SKU, name, category, cost price, selling price, and opening stock",
      });
    }

    const numCost = Number(costPrice);
    const numSelling = Number(sellingPrice);
    const numOpening = Number(openingStock);
    const numReorder = reorderLevel !== undefined ? Number(reorderLevel) : 5;

    if (isNaN(numCost) || numCost < 0) {
      return res.status(400).json({ message: "Cost price must be a non-negative number" });
    }

    if (isNaN(numSelling) || numSelling < 0) {
      return res.status(400).json({ message: "Selling price must be a non-negative number" });
    }

    if (isNaN(numOpening) || numOpening < 0 || !Number.isInteger(numOpening)) {
      return res.status(400).json({ message: "Opening stock must be a non-negative integer" });
    }

    if (isNaN(numReorder) || numReorder < 0 || !Number.isInteger(numReorder)) {
      return res.status(400).json({ message: "Reorder level must be a non-negative integer" });
    }

    const normalizedSku = sku.trim().toUpperCase();
    const existingProduct = await Product.findOne({ sku: normalizedSku });
    if (existingProduct) {
      return res.status(409).json({ message: `Product with SKU '${normalizedSku}' already exists` });
    }

    const product = new Product({
      sku: normalizedSku,
      name: name.trim(),
      category: category.trim(),
      unit: unit ? unit.trim() : "pcs",
      costPrice: numCost,
      sellingPrice: numSelling,
      openingStock: numOpening,
      currentStock: numOpening,
      reorderLevel: numReorder,
    });

    await product.save();

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Product with this SKU already exists" });
    }
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      category,
      unit,
      costPrice,
      sellingPrice,
      reorderLevel,
      openingStock,
      currentStock,
    } = req.body;

    if (currentStock !== undefined || openingStock !== undefined) {
      return res.status(400).json({
        message: "Stock quantities cannot be edited directly. Use Stock IN/OUT transactions.",
      });
    }

    const product = await Product.findOne({ _id: id });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (name !== undefined) {
      if (typeof name !== "string" || name.trim() === "") {
        return res.status(400).json({ message: "Product name cannot be empty" });
      }
      product.name = name.trim();
    }

    if (category !== undefined) {
      if (typeof category !== "string" || category.trim() === "") {
        return res.status(400).json({ message: "Category cannot be empty" });
      }
      product.category = category.trim();
    }

    if (unit !== undefined) {
      if (typeof unit !== "string" || unit.trim() === "") {
        return res.status(400).json({ message: "Unit cannot be empty" });
      }
      product.unit = unit.trim();
    }

    if (costPrice !== undefined) {
      const numCost = Number(costPrice);
      if (isNaN(numCost) || numCost < 0) {
        return res.status(400).json({ message: "Cost price must be a non-negative number" });
      }
      product.costPrice = numCost;
    }

    if (sellingPrice !== undefined) {
      const numSelling = Number(sellingPrice);
      if (isNaN(numSelling) || numSelling < 0) {
        return res.status(400).json({ message: "Selling price must be a non-negative number" });
      }
      product.sellingPrice = numSelling;
    }

    if (reorderLevel !== undefined) {
      const numReorder = Number(reorderLevel);
      if (isNaN(numReorder) || numReorder < 0 || !Number.isInteger(numReorder)) {
        return res.status(400).json({ message: "Reorder level must be a non-negative integer" });
      }
      product.reorderLevel = numReorder;
    }

    await product.save();

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Product not found" });
    }
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({ _id: id });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const hasHistory = await StockMovement.findOne({ product: id });
    if (hasHistory) {
      return res.status(400).json({
        message: "Cannot delete product with existing stock movement history. Inventory audit trail must be preserved.",
      });
    }

    await Product.deleteOne({ _id: id });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Product not found" });
    }
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
