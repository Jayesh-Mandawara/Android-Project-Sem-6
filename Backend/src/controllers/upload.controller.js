const cloudinary = require("../config/cloudinary.config");
const fs = require("fs");

exports.uploadVideo = async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const result = await cloudinary.uploader.upload(file.path, {
            resource_type: "video",
        });

        // Delete the file from local uploads folder
        fs.unlink(file.path, (err) => {
            if (err) console.error("Error deleting local file:", err);
        });

        res.json({
            videoUrl: result.secure_url,
        });
    } catch (err) {
        // Also try to delete file if upload failed
        if (req.file) {
            fs.unlink(req.file.path, () => {});
        }
        res.status(500).json({ error: err.message });
    }
};
