const express = require("express");
const router = express.Router();
const enrollmentController = require("../controllers/enrollment.controller");
const { protect } = require("../middleware/auth.middleware");

router.use(protect);

router.post("/enroll", enrollmentController.enrollCourse);
router.get("/my-courses", enrollmentController.getMyCourses);
router.patch("/progress", enrollmentController.updateProgress);

module.exports = router;
