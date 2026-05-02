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

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            status: "success",
            data: { user },
        });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};

exports.updateMe = async (req, res) => {
    try {
        // 1) Error if user posts password data
        if (req.body.password) {
            return res.status(400).json({
                status: "fail",
                message: "This route is not for password updates. Please use /updatePassword",
            });
        }

        // 2) Filtered out unwanted fields that are not allowed to be updated
        const filteredBody = {};
        const allowedFields = ["name", "email"];
        Object.keys(req.body).forEach((el) => {
            if (allowedFields.includes(el)) filteredBody[el] = req.body[el];
        });

        // 3) Update user document
        const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            status: "success",
            data: {
                user: updatedUser,
            },
        });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};

exports.blockUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ status: "fail", message: "User not found" });

        user.isActive = !user.isActive;
        await user.save({ validateBeforeSave: false });

        res.status(200).json({ status: "success", data: { user } });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(204).json({ status: "success", data: null });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};

exports.forceResetPassword = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ status: "fail", message: "User not found" });

        user.password = "shiksha123";
        await user.save();

        res.status(200).json({ status: "success", message: "Password reset to shiksha123" });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};
