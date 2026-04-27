const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const ticketSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "Ticket must belong to a student"],
    },
    course: {
        type: mongoose.Schema.ObjectId,
        ref: "Course",
        required: [true, "Ticket must be related to a course"],
    },
    subject: {
        type: String,
        required: [true, "Please provide a subject for your query"],
    },
    description: {
        type: String,
        required: [true, "Please describe your query"],
    },
    status: {
        type: String,
        enum: ["OPEN", "CLOSED"],
        default: "OPEN",
    },
    replies: [replySchema],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Ticket", ticketSchema);
