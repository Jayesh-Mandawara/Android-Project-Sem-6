const express = require("express");
const router = express.Router();
const multer = require("multer");

const { uploadFile } = require("../controllers/upload.controller");

// upload files max of 100 MB
const upload = multer({
    dest: "uploads/",
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB
    },
});

router.post("/", upload.single("file"), uploadFile);

module.exports = router;
