const cloudinary = require("../config/cloudinary.config");

exports.uploadVideo = async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const result = await cloudinary.uploader.upload(file.path, {
            resource_type: "video",
        });

        res.json({
            videoUrl: result.secure_url,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
