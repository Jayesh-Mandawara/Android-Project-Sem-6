const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const crypto = require("crypto");
const sendEmail = require("../utils/email");

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        status: "success",
        token,
        data: {
            user,
        },
    });
};

exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        const newUser = await User.create({
            name,
            email,
            password,
            role: role || "STUDENT",
        });

        createSendToken(newUser, 201, res);
    } catch (err) {
        res.status(400).json({ status: "fail", message: err.message });
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ status: "fail", message: "Please provide email and password!" });
        }

        const user = await User.findOne({ email }).select("+password +isActive");

        if (!user || !(await user.correctPassword(password, user.password))) {
            return res.status(401).json({ status: "fail", message: "Incorrect email or password" });
        }

        if (user.isActive === false) {
            return res.status(403).json({ status: "fail", message: "Your account has been blocked by an administrator." });
        }

        createSendToken(user, 200, res);
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};

exports.logout = (req, res) => {
    res.status(200).json({ status: "success", message: "Logged out successfully" });
};

exports.forgotPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ status: "fail", message: "There is no user with email address." });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        user.passwordResetOTP = otp;
        user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
        await user.save({ validateBeforeSave: false });

        try {
            await sendEmail({
                email: user.email,
                subject: "Your password reset OTP (valid for 10 min)",
                message: `Your password reset OTP is: ${otp}`,
            });

            res.status(200).json({
                status: "success",
                message: "OTP sent to email!",
            });
        } catch (err) {
            console.error("Email send failed:", err);
            user.passwordResetOTP = undefined;
            user.passwordResetExpires = undefined;
            await user.save({ validateBeforeSave: false });

            return res.status(500).json({ status: "error", message: "There was an error sending the email. Try again later!" });
        }
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};

exports.resetPassword = async (req, res, next) => {
    try {
        const { email, otp, password } = req.body;

        const user = await User.findOne({
            email,
            passwordResetOTP: otp,
            passwordResetExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ status: "fail", message: "OTP is invalid or has expired" });
        }

        user.password = password;
        user.passwordResetOTP = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        createSendToken(user, 200, res);
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};
