const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
    day: Number,
    title: String,
    videoUrl: String,
    duration: Number,
    description: { type: String, default: "" },
    thumbnailUrl: { type: String, default: "" },
});

const courseSchema = new mongoose.Schema({
    title: String,
    description: String,
    instructorName: { type: String, default: "Unknown" },
    coverImageUrl: { type: String, default: "" },
    totalDays: Number,
    videos: [videoSchema],
});

module.exports = mongoose.model("Course", courseSchema);
