const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

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

        // 1) Check if email and password exist
        if (!email || !password) {
            return res.status(400).json({ status: "fail", message: "Please provide email and password!" });
        }

        // 2) Check if user exists && password is correct
        const user = await User.findOne({ email }).select("+password");

        if (!user || !(await user.correctPassword(password, user.password))) {
            return res.status(401).json({ status: "fail", message: "Incorrect email or password" });
        }

        // 3) If everything ok, send token to client
        createSendToken(user, 200, res);
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};

exports.logout = (req, res) => {
    res.status(200).json({ status: "success", message: "Logged out successfully" });
};
