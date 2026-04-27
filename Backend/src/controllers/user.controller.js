const User = require("../models/user.model");

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
            status: "success",
            results: users.length,
            data: { users },
        });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ status: "fail", message: "User not found" });
        }
        res.status(200).json({
            status: "success",
            data: { user },
        });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};
