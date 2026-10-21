const express = require("express");
const router = express.Router();
const {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} = require("../controllers/supplierController");
const { auth, authorizeRoles } = require("../middleware/auth");

router.use(auth);

router.get("/", getSuppliers);
router.post("/", authorizeRoles("admin"), createSupplier);
router.put("/:id", authorizeRoles("admin"), updateSupplier);
router.delete("/:id", authorizeRoles("admin"), deleteSupplier);

module.exports = router;
