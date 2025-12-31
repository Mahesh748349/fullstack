const express = require("express");
const Property = require("../models/Property");
const auth = require("../middleware/authMiddleware");
const ownerOnly = require("../middleware/ownerOnly");

const router = express.Router();

/* PUBLIC LIST */
router.get("/", async (req, res) => {
  const props = await Property.find({ available: true }).populate(
    "owner",
    "name"
  );
  res.json(props);
});

/* ADD PROPERTY */
router.post("/", auth, ownerOnly, async (req, res) => {
  const property = await Property.create({
    ...req.body,
    owner: req.user.id,
  });
  res.json(property);
});

/* GET OWNER PROPERTIES */
router.get("/mine", auth, ownerOnly, async (req, res) => {
  const properties = await Property.find({ owner: req.user.id });
  res.json(properties);
});

/* DELETE PROPERTY */
router.delete("/:id", auth, ownerOnly, async (req, res) => {
  await Property.deleteOne({ _id: req.params.id, owner: req.user.id });
  res.json({ message: "Property deleted" });
});

module.exports = router;
