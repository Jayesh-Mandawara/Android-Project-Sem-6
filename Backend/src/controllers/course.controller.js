const Course = require("../models/course.model.js");
const Enrollment = require("../models/enrollment.model.js");
const getUnlockedVideos = require("../utils/unlockLogic");

exports.getCourse = async (req, res) => {
    try {
        const { courseId } = req.params; // Changed to params for better REST
        const userId = req.user.id;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ status: "fail", message: "Course not found" });
        }

        // If user is STUDENT, check enrollment
        if (req.user.role === "STUDENT") {
            const enrollment = await Enrollment.findOne({ userId, courseId });
            if (!enrollment) {
                return res.status(403).json({
                    status: "fail",
                    message: "You must be enrolled to access this course content",
                });
            }

            const unlockedVideos = getUnlockedVideos(course, enrollment.enrolledAt);
            return res.status(200).json({
                status: "success",
                data: {
                    ...course.toObject(),
                    videos: unlockedVideos,
                },
            });
        }

        // Admin/Instructor can see all videos
        res.status(200).json({
            status: "success",
            data: course.toObject(),
        });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};

exports.createCourse = async (req, res) => {
    try {
        const { title, description, instructorName, coverImageUrl, totalDays, videos } = req.body;

        const course = await Course.create({
            title,
            description,
            instructorName: instructorName || req.user.name,
            coverImageUrl,
            totalDays,
            videos,
        });

        res.status(201).json({
            status: "success",
            data: { course },
        });
    } catch (err) {
        res.status(400).json({ status: "fail", message: err.message });
    }
};

exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json({
            status: "success",
            results: courses.length,
            data: { courses },
        });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};

exports.updateCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, {
            new: true,
            runValidators: true,
        });

        if (!course) {
            return res.status(404).json({ status: "fail", message: "Course not found" });
        }

        res.status(200).json({
            status: "success",
            data: { course },
        });
    } catch (err) {
        res.status(400).json({ status: "fail", message: err.message });
    }
};

exports.getInstructorCourses = async (req, res) => {
    try {
        const courses = await Course.find({ instructorName: req.user.name });
        res.status(200).json({
            status: "success",
            results: courses.length,
            data: { courses },
        });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};
