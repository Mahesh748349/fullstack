const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: { type: String, required: true },
    city: { type: String, required: true },
    area: { type: String, required: true },

    rent: { type: Number, required: true },
    deposit: { type: Number, required: true },

    propertyType: {
      type: String,
      enum: ["Room", "1BHK", "2BHK"],
      required: true,
    },

    description: String,
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema);
