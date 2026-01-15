const express = require("express");
const auth = require("../middleware/authMiddleware");
const Maintenance = require("../models/Maintenance");
const Application = require("../models/Application");

const router = express.Router();

/* =========================
   TENANT: CREATE REQUEST
========================= */
router.post("/:applicationId", auth, async (req, res) => {
  try {
    if (req.user.role !== "tenant") {
      return res.status(403).json({ message: "Tenant access only" });
    }

    const app = await Application.findOne({
      _id: req.params.applicationId,
      tenant: req.user.id,
      status: "Approved",
    });

    if (!app) {
      return res.status(400).json({ message: "Invalid or unapproved application" });
    }

    const maintenance = await Maintenance.create({
      property: app.property,
      tenant: req.user.id,
      owner: app.owner,
      issue: req.body.issue,
      status: "Pending", // ✅ default
    });

    res.json({ message: "Maintenance request created", maintenance });
  } catch (err) {
    console.error("MAINTENANCE CREATE ERROR:", err);
    res.status(500).json({ message: "Failed to create request" });
  }
});

/* =========================
   TENANT: VIEW OWN REQUESTS
========================= */
router.get("/tenant", auth, async (req, res) => {
  try {
    if (req.user.role !== "tenant") {
      return res.status(403).json({ message: "Tenant access only" });
    }

    const data = await Maintenance.find({ tenant: req.user.id })
      .populate("property", "title")
      .sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    console.error("TENANT MAINT FETCH ERROR:", err);
    res.status(500).json({ message: "Failed to fetch requests" });
  }
});

/* =========================
   OWNER: VIEW REQUESTS
========================= */
router.get("/owner", auth, async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.status(403).json({ message: "Owner access only" });
    }

    const data = await Maintenance.find({ owner: req.user.id })
      .populate("property", "title")
      .populate("tenant", "name email")
      .sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    console.error("OWNER MAINT FETCH ERROR:", err);
    res.status(500).json({ message: "Failed to fetch requests" });
  }
});

/* =========================
   OWNER: UPDATE STATUS
========================= */
router.put("/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.status(403).json({ message: "Owner access only" });
    }

    const m = await Maintenance.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!m) {
      return res.status(404).json({ message: "Request not found" });
    }

    m.status = req.body.status;
    await m.save();

    res.json({ message: "Status updated" });
  } catch (err) {
    console.error("MAINT STATUS ERROR:", err);
    res.status(500).json({ message: "Failed to update status" });
  }
});

module.exports = router;
