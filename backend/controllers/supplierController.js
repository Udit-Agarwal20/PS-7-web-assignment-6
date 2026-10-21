const Supplier = require("../models/Supplier");
const StockMovement = require("../models/StockMovement");

const getSuppliers = async (req, res, next) => {
  try {
    const suppliers = await Supplier.find({}).sort({ name: 1 });
    res.status(200).json({ suppliers });
  } catch (error) {
    next(error);
  }
};

const createSupplier = async (req, res, next) => {
  try {
    const { name, phone, city } = req.body;

    if (!name || !phone || !city) {
      return res.status(400).json({
        message: "Please provide name, phone, and city for the supplier",
      });
    }

    const supplier = new Supplier({
      name: name.trim(),
      phone: phone.trim(),
      city: city.trim(),
    });

    await supplier.save();

    res.status(201).json({
      message: "Supplier created successfully",
      supplier,
    });
  } catch (error) {
    next(error);
  }
};

const updateSupplier = async (req, res, next) => {
  try {
    const { id } = req.params;
    const supplier = await Supplier.findOne({ _id: id });
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    const { name, phone, city } = req.body;

    if (name !== undefined) {
      if (typeof name !== "string" || name.trim() === "") {
        return res.status(400).json({ message: "Supplier name cannot be empty" });
      }
      supplier.name = name.trim();
    }

    if (phone !== undefined) {
      if (typeof phone !== "string" || phone.trim() === "") {
        return res.status(400).json({ message: "Phone cannot be empty" });
      }
      supplier.phone = phone.trim();
    }

    if (city !== undefined) {
      if (typeof city !== "string" || city.trim() === "") {
        return res.status(400).json({ message: "City cannot be empty" });
      }
      supplier.city = city.trim();
    }

    await supplier.save();

    res.status(200).json({
      message: "Supplier updated successfully",
      supplier,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Supplier not found" });
    }
    next(error);
  }
};

const deleteSupplier = async (req, res, next) => {
  try {
    const { id } = req.params;

    const supplier = await Supplier.findOne({ _id: id });
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    const hasHistory = await StockMovement.findOne({ supplier: id });
    if (hasHistory) {
      return res.status(400).json({
        message: "Cannot delete supplier with existing stock movement history. Audit trail must be preserved.",
      });
    }

    await Supplier.deleteOne({ _id: id });

    res.status(200).json({ message: "Supplier deleted successfully" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Supplier not found" });
    }
    next(error);
  }
};

module.exports = {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};
