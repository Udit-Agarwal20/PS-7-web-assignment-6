const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  sku: {
    type: String,
    required: [true, "SKU is required"],
    unique: true,
    trim: true,
    uppercase: true,
  },
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    trim: true,
  },
  unit: {
    type: String,
    required: [true, "Unit is required"],
    trim: true,
    default: "pcs",
  },
  costPrice: {
    type: Number,
    required: [true, "Cost price is required"],
    min: [0, "Cost price cannot be negative"],
  },
  sellingPrice: {
    type: Number,
    required: [true, "Selling price is required"],
    min: [0, "Selling price cannot be negative"],
  },
  openingStock: {
    type: Number,
    required: [true, "Opening stock is required"],
    min: [0, "Opening stock cannot be negative"],
    default: 0,
  },
  currentStock: {
    type: Number,
    required: [true, "Current stock is required"],
    min: [0, "Current stock cannot be negative"],
    default: 0,
  },
  reorderLevel: {
    type: Number,
    required: [true, "Reorder level is required"],
    min: [0, "Reorder level cannot be negative"],
    default: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
