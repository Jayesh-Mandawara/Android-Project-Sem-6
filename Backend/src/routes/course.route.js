const express = require("express");
const router = express.Router();

const { getCourse, createCourse, getAllCourses } = require("../controllers/course.controller");

router.get("/", getCourse);
router.post("/create", createCourse);
router.get("/all", getAllCourses);

module.exports = router;
