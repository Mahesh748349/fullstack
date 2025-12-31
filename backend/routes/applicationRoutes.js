const express = require("express");
const auth = require("../middleware/authMiddleware");
const Application = require("../models/Application");
const Property = require("../models/Property");

const router = express.Router();

/* TENANT APPLY */
router.post("/apply/:propertyId", auth, async (req, res) => {
  if (req.user.role !== "tenant") {
    return res.status(403).json({ message: "Tenant access only" });
  }

  const property = await Property.findById(req.params.propertyId);
  if (!property) return res.status(404).json({ message: "Property not found" });

  const exists = await Application.findOne({
    property: property._id,
    tenant: req.user.id,
  });
  if (exists) return res.status(400).json({ message: "Already applied" });

  const app = await Application.create({
    property: property._id,
    tenant: req.user.id,
    owner: property.owner,
  });

  res.json(app);
});

/* OWNER VIEW APPLICATIONS */
router.get("/owner", auth, async (req, res) => {
  if (req.user.role !== "owner") {
    return res.status(403).json({ message: "Owner access only" });
  }

  const apps = await Application.find({ owner: req.user.id })
    .populate("tenant", "name email")
    .populate("property", "title city area rent");

  res.json(apps);
});

/* OWNER DECISION */
router.put("/:id", auth, async (req, res) => {
  if (req.user.role !== "owner") {
    return res.status(403).json({ message: "Owner access only" });
  }

  const app = await Application.findOne({
    _id: req.params.id,
    owner: req.user.id,
  });

  if (!app) return res.status(404).json({ message: "Application not found" });

  app.status = req.body.status;
  await app.save();

  res.json({ message: "Application updated" });
});

/* TENANT VIEW OWN APPLICATIONS */
router.get("/tenant", auth, async (req, res) => {
  try {
    if (req.user.role !== "tenant") {
      return res.status(403).json({ message: "Tenant access only" });
    }

    const applications = await Application.find({
      tenant: req.user.id,
    }).populate({
      path: "property",
      select: "title city area rent",
    });

    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
