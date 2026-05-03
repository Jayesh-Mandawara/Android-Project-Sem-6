const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("../middleware/auth.middleware");

const { getCourse, createCourse, getAllCourses, updateCourse, getInstructorCourses } = require("../controllers/course.controller");

router.get("/all", getAllCourses);
router.get("/instructor/my-courses", protect, restrictTo("INSTRUCTOR"), getInstructorCourses);
router.get("/:courseId", protect, getCourse);
router.post("/create", protect, restrictTo("ADMIN", "INSTRUCTOR"), createCourse);
router.put("/:courseId", protect, restrictTo("ADMIN"), updateCourse);

module.exports = router;
