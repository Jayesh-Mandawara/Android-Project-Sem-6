const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema({
    userId: String,
    courseId: String,
    enrolledAt: {
        type: Date,
        default: Date.now,
    },
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    }
});

module.exports = mongoose.model("Enrollment", enrollmentSchema);
