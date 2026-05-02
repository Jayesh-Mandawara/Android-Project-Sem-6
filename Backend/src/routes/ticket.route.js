const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticket.controller");
const { protect, restrictTo } = require("../middleware/auth.middleware");

router.use(protect);

router.post("/", restrictTo("STUDENT", "INSTRUCTOR"), ticketController.createTicket);
router.get("/", ticketController.getTickets);
router.post("/:id/reply", ticketController.replyToTicket);
router.patch("/:id/close", restrictTo("ADMIN", "INSTRUCTOR"), ticketController.closeTicket);

module.exports = router;
