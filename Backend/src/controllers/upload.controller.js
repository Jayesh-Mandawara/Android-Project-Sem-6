const cloudinary = require("../config/cloudinary.config");
const fs = require("fs");

exports.uploadFile = async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const result = await cloudinary.uploader.upload(file.path, {
            resource_type: "auto",
        });

        // Delete the file from local uploads folder
        fs.unlink(file.path, (err) => {
            if (err) console.error("Error deleting local file:", err);
        });

        // Return the secure URL from Cloudinary
        res.json({
            fileUrl: result.secure_url,
            resource_type: result.resource_type,
        });
    } catch (err) {
        // Also try to delete file if upload failed
        if (req.file) {
            fs.unlink(req.file.path, () => {});
        }
        res.status(500).json({ error: err.message });
    }
};
