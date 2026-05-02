const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("../middleware/auth.middleware");
const pendingController = require("../controllers/pendingContent.controller");

router.use(protect);

router.post("/", restrictTo("INSTRUCTOR"), pendingController.submitPendingContent);
router.get("/", restrictTo("ADMIN"), pendingController.getPendingContent);
router.patch("/:id/approve", restrictTo("ADMIN"), pendingController.approvePendingContent);
router.patch("/:id/reject", restrictTo("ADMIN"), pendingController.rejectPendingContent);

module.exports = router;
