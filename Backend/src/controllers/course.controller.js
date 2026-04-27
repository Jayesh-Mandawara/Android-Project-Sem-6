const Course = require("../models/course.model.js");
const Enrollment = require("../models/enrollment.model.js");
const getUnlockedVideos = require("../utils/unlockLogic");

exports.getCourse = async (req, res) => {
    try {
        const { userId, courseId } = req.query;

        // const course = await Course.findById(courseId);
        // const enrollment = await Enrollment.findOne({ userId, courseId });

        // if (!enrollment) {
        //     return res.status(400).json({ message: "Not enrolled" });
        // }

        // const unlockedVideos = getUnlockedVideos(course, enrollment.enrolledAt);

        // res.json({
        //     ...course.toObject(),
        //     videos: unlockedVideos,
        // });

        const course = await Course.findById(courseId);
        const enrollment = await Enrollment.findOne({ userId, courseId });

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        let enrolledAt = enrollment?.enrolledAt || new Date();

        const unlockedVideos = getUnlockedVideos(course, enrolledAt);

        res.json({
            ...course.toObject(),
            videos: unlockedVideos,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createCourse = async (req, res) => {
    try {
        const { title, description, instructorName, coverImageUrl, totalDays, videos } = req.body;

        const course = await Course.create({
            title,
            description,
            instructorName,
            coverImageUrl,
            totalDays,
            videos,
        });

        res.json(course);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
