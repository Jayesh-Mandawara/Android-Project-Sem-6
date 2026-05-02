const Enrollment = require("../models/enrollment.model");
const Course = require("../models/course.model");

exports.enrollCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const userId = req.user.id;

        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ status: "fail", message: "Course not found" });
        }

        // Check if already enrolled
        const existingEnrollment = await Enrollment.findOne({ userId, courseId });
        if (existingEnrollment) {
            return res.status(400).json({ status: "fail", message: "Already enrolled in this course" });
        }

        const enrollment = await Enrollment.create({
            userId,
            courseId,
            enrolledAt: new Date(),
        });

        res.status(201).json({
            status: "success",
            data: { enrollment },
        });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};

exports.getMyCourses = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ userId: req.user.id });
        const courseIds = enrollments.map((e) => e.courseId);

        const courses = await Course.find({ _id: { $in: courseIds } });

        res.status(200).json({
            status: "success",
            results: courses.length,
            data: { courses },
        });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};

exports.updateProgress = async (req, res) => {
    try {
        const { courseId, progress } = req.body;
        const userId = req.user.id;

        const enrollment = await Enrollment.findOneAndUpdate(
            { userId, courseId },
            { progress },
            { new: true, runValidators: true }
        );

        if (!enrollment) {
            return res.status(404).json({ status: "fail", message: "Enrollment not found" });
        }

        res.status(200).json({
            status: "success",
            data: { enrollment },
        });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};
