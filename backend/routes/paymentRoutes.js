const express = require("express");
const auth = require("../middleware/authMiddleware");
const Payment = require("../models/Payment");
const Application = require("../models/Application");

const router = express.Router();

/* TENANT: CREATE PAYMENT */
router.post("/pay/:applicationId", auth, async (req, res) => {
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
    amount: app.property.rent, // 🔥 auto from property
  });

  res.json({ message: "Payment submitted", payment });
});

/* OWNER: VIEW PAYMENTS */
router.get("/owner", auth, async (req, res) => {
  if (req.user.role !== "owner") {
    return res.status(403).json({ message: "Owner access only" });
  }

  const payments = await Payment.find({ owner: req.user.id })
    .populate("tenant", "name email")
    .populate("property", "title");

  res.json(payments);
});

/* TENANT: VIEW PAYMENTS */
router.get("/tenant", auth, async (req, res) => {
  if (req.user.role !== "tenant") {
    return res.status(403).json({ message: "Tenant access only" });
  }

  const payments = await Payment.find({ tenant: req.user.id }).populate(
    "property",
    "title"
  );

  res.json(payments);
});

/* OWNER: APPROVE / REJECT */
router.put("/:id", auth, async (req, res) => {
  if (req.user.role !== "owner") {
    return res.status(403).json({ message: "Owner access only" });
  }

  const payment = await Payment.findOne({
    _id: req.params.id,
    owner: req.user.id,
  });

  if (!payment) return res.status(404).json({ message: "Payment not found" });

  payment.status = req.body.status;
  await payment.save();

  res.json({ message: "Payment updated" });
});

module.exports = router;
