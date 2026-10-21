const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { auth, authorizeRoles } = require("../middleware/auth");

router.use(auth);

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", authorizeRoles("admin"), createProduct);
router.put("/:id", authorizeRoles("admin"), updateProduct);
router.delete("/:id", authorizeRoles("admin"), deleteProduct);

module.exports = router;
