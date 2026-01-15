const express = require("express");
const auth = require("../middleware/authMiddleware");
const Payment = require("../models/Payment");
const Application = require("../models/Application");

const router = express.Router();

/* =========================
   TENANT: CREATE PAYMENT
========================= */
router.post("/pay/:applicationId", auth, async (req, res) => {
  try {
    if (req.user.role !== "tenant") {
      return res.status(403).json({ message: "Tenant access only" });
    }

    const { month } = req.body;

    const app = await Application.findOne({
      _id: req.params.applicationId,
      tenant: req.user.id,
      status: "Approved",
    }).populate("property");

    if (!app) {
      return res.status(400).json({ message: "Approved application not found" });
    }

    const payment = await Payment.create({
      property: app.property._id,
      tenant: req.user.id,
      owner: app.owner,
      month,
      amount: app.property.rent,
      status: "Paid", // ✅ default
    });

    res.json({ message: "Payment submitted", payment });
  } catch (err) {
    console.error("PAYMENT CREATE ERROR:", err);
    res.status(500).json({ message: "Payment failed" });
  }
});

/* =========================
   OWNER: VIEW PAYMENTS
========================= */
router.get("/owner", auth, async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.status(403).json({ message: "Owner access only" });
    }

    const payments = await Payment.find({ owner: req.user.id })
      .populate("tenant", "name email")
      .populate("property", "title")
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (err) {
    console.error("OWNER PAY FETCH ERROR:", err);
    res.status(500).json({ message: "Failed to fetch payments" });
  }
});

/* =========================
   TENANT: VIEW PAYMENTS
========================= */
router.get("/tenant", auth, async (req, res) => {
  try {
    if (req.user.role !== "tenant") {
      return res.status(403).json({ message: "Tenant access only" });
    }

    const payments = await Payment.find({ tenant: req.user.id })
      .populate("property", "title")
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (err) {
    console.error("TENANT PAY FETCH ERROR:", err);
    res.status(500).json({ message: "Failed to fetch payments" });
  }
});

/* =========================
   OWNER: UPDATE PAYMENT STATUS
========================= */
router.put("/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.status(403).json({ message: "Owner access only" });
    }

    const payment = await Payment.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    payment.status = req.body.status;
    await payment.save();

    res.json({ message: "Payment updated" });
  } catch (err) {
    console.error("PAY STATUS ERROR:", err);
    res.status(500).json({ message: "Failed to update payment" });
  }
});

module.exports = router;
