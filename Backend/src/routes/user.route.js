const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { protect, restrictTo } = require("../middleware/auth.middleware");

// Protect all routes after this middleware
router.use(protect);

router.get("/profile", userController.getMe);
router.patch("/updateMe", userController.updateMe);

router.get("/", restrictTo("ADMIN"), userController.getAllUsers);
router.get("/:id", restrictTo("ADMIN"), userController.getUserById);

module.exports = router;
