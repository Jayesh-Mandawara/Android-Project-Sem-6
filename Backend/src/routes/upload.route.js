const express = require("express");
const router = express.Router();
const multer = require("multer");

const { uploadVideo } = require("../controllers/upload.controller");

const upload = multer({
    dest: "uploads/",
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB
    },
});

router.post("/", upload.single("video"), uploadVideo);

module.exports = router;
