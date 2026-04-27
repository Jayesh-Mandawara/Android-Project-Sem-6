const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./src/config/database.config");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/courses", require("./src/routes/course.route"));
app.use("/api/upload", require("./src/routes/upload.route"));

app.listen(process.env.PORT, () => console.log("Server running on port " + process.env.PORT));