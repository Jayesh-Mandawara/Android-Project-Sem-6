const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./src/config/database.config");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", require("./src/routes/auth.route"));
app.use("/api/users", require("./src/routes/user.route"));
app.use("/api/courses", require("./src/routes/course.route"));
app.use("/api/enroll", require("./src/routes/enrollment.route"));
app.use("/api/tickets", require("./src/routes/ticket.route"));
app.use("/api/upload", require("./src/routes/upload.route"));
app.use("/api/pending", require("./src/routes/pendingContent.route"));

app.listen(process.env.PORT, () => console.log("Server running on port " + process.env.PORT));

// Trigger nodemon restart