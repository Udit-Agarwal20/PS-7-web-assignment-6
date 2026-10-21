const mongoose = require("mongoose");

const stockMovementSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Product reference is required"],
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
  },
  movementType: {
    type: String,
    enum: ["IN", "OUT"],
    required: [true, "Movement type must be IN or OUT"],
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [1, "Quantity must be at least 1"],
  },
  unitCost: {
    type: Number,
    required: [true, "Unit cost is required"],
    min: [0, "Unit cost cannot be negative"],
  },
  unitSellingPrice: {
    type: Number,
    min: [0, "Unit selling price cannot be negative"],
  },
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Recorded-by user reference is required"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const StockMovement = mongoose.model("StockMovement", stockMovementSchema);

module.exports = StockMovement;
