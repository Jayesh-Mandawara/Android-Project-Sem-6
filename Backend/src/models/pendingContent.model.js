const mongoose = require("mongoose");

const pendingContentSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.ObjectId,
        ref: "Course",
        required: false, 
    },
    instructorId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    type: {
        type: String,
        enum: ["NEW_COURSE", "NEW_VIDEO"],
        required: true,
    },
    contentData: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    status: {
        type: String,
        enum: ["PENDING", "APPROVED", "REJECTED"],
        default: "PENDING",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model("PendingContent", pendingContentSchema);
