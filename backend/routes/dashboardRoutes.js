const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../controllers/dashboardController");
const { auth, authorizeRoles } = require("../middleware/auth");

router.use(auth);

router.get("/stats", authorizeRoles("admin"), getDashboardStats);

module.exports = router;
