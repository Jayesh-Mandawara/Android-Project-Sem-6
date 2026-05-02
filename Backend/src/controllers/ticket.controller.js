const Ticket = require("../models/ticket.model");
const Course = require("../models/course.model");

exports.createTicket = async (req, res) => {
// ... existing createTicket ...
};

exports.getTickets = async (req, res) => {
    try {
        let filter = {};
        if (req.user.role === "STUDENT") {
            filter.student = req.user.id;
        } else if (req.user.role === "INSTRUCTOR") {
            const courses = await Course.find({ instructorName: req.user.name });
            const courseIds = courses.map(c => c._id);
            filter = {
                $or: [
                    { course: { $in: courseIds } },
                    { student: req.user.id }
                ]
            };
        }

        if (req.query.courseId) {
            filter.course = req.query.courseId;
        }

        const tickets = await Ticket.find(filter).populate("student", "name email").populate("course", "title");

        res.status(200).json({
            status: "success",
            results: tickets.length,
            data: { tickets },
        });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};

exports.replyToTicket = async (req, res) => {
    try {
        const { message } = req.body;
        const ticketId = req.params.id;

        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({ status: "fail", message: "Ticket not found" });
        }

        ticket.replies.push({
            userId: req.user.id,
            message,
        });

        await ticket.save();

        const populatedTicket = await Ticket.findById(ticketId)
            .populate("student", "name email")
            .populate("course", "title");

        res.status(200).json({
            status: "success",
            data: { ticket: populatedTicket },
        });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};

exports.closeTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findByIdAndUpdate(req.params.id, { status: "CLOSED" }, { new: true })
            .populate("student", "name email")
            .populate("course", "title");
        res.status(200).json({
            status: "success",
            data: { ticket },
        });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};
