const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("../middleware/auth.middleware");

const { getCourse, createCourse, getAllCourses } = require("../controllers/course.controller");

router.get("/all", getAllCourses);
router.get("/:courseId", protect, getCourse);
router.post("/create", protect, restrictTo("ADMIN", "INSTRUCTOR"), createCourse);

module.exports = router;
