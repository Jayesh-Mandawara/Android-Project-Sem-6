const PendingContent = require("../models/pendingContent.model");
const Course = require("../models/course.model");
const User = require("../models/user.model");

exports.submitPendingContent = async (req, res) => {
    try {
        const { courseId, type, contentData } = req.body;
        const instructorId = req.user.id;

        const pending = await PendingContent.create({
            courseId,
            instructorId,
            type,
            contentData,
        });

        // Populate instructorId and courseId to match frontend DTO (expects objects, not string IDs)
        await pending.populate("instructorId", "name email role isActive profilePicture");
        if (pending.courseId) {
            await pending.populate("courseId", "title");
        }

        res.status(201).json({ status: "success", data: { pending } });
    } catch (err) {
        res.status(400).json({ status: "fail", message: err.message });
    }
};

exports.getPendingContent = async (req, res) => {
    try {
        const pending = await PendingContent.find({ status: "PENDING" })
            .populate("instructorId", "name email")
            .populate("courseId", "title");

        res.status(200).json({ status: "success", results: pending.length, data: { pending } });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};

exports.approvePendingContent = async (req, res) => {
    try {
        const pending = await PendingContent.findById(req.params.id).populate("instructorId", "name");
        if (!pending) return res.status(404).json({ status: "fail", message: "Not found" });

        if (pending.type === "NEW_COURSE") {
            await Course.create({
                ...pending.contentData,
                instructorName: pending.instructorId.name
            });
        } else if (pending.type === "NEW_VIDEO") {
            const course = await Course.findById(pending.courseId);
            if (!course) return res.status(404).json({ status: "fail", message: "Course not found" });
            
            course.videos.push(pending.contentData);
            await course.save();
        }

        pending.status = "APPROVED";
        await pending.save();

        res.status(200).json({ status: "success", message: "Content approved and published!" });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};

exports.rejectPendingContent = async (req, res) => {
    try {
        const pending = await PendingContent.findByIdAndUpdate(req.params.id, { status: "REJECTED" }, { new: true });
        res.status(200).json({ status: "success", data: { pending } });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};
