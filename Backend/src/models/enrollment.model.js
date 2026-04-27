const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema({
    userId: String,
    courseId: String,
    enrolledAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Enrollment", enrollmentSchema);
