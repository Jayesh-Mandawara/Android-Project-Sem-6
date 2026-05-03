const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
    day: Number,
    title: String,
    videoUrl: String,
    duration: Number,
    description: { type: String, default: "" },
    thumbnailUrl: { type: String, default: "" },
});

const noteSchema = new mongoose.Schema({
    title: String,
    pdfUrl: String,
});

const courseSchema = new mongoose.Schema({
    title: String,
    description: String,
    category: { type: String, default: "General" },
    instructorName: { type: String, default: "Unknown" },
    coverImageUrl: { type: String, default: "" },
    totalDays: Number,
    videos: [videoSchema],
    notes: [noteSchema],
});

module.exports = mongoose.model("Course", courseSchema);
