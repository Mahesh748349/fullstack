const mongoose = require("mongoose");

const TenantDetailsSchema = new mongoose.Schema({
  contact: {
    primaryMobile: { type: String, required: true }
  },
  permanentAddress: {
    city: { type: String, required: true }
  },
  occupation: {
    type: { type: String, required: true },
    companyOrCollege: { type: String }
  },
  income: {
    monthlyIncome: { type: Number }
  }
});

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["owner", "tenant"],
      required: true
    },

    // ✅ THIS WAS MISSING
    tenantDetails: {
      type: TenantDetailsSchema,
      required: function () {
        return this.role === "tenant";
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
