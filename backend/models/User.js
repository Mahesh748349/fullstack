const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["tenant", "owner"],
      required: true,
    },

    // TENANT DETAILS (OPTIONAL, SAFE)
    tenantDetails: {
      aadhaarNumber: String,

      contact: {
        primaryMobile: String,
        alternateMobile: String,
      },

      permanentAddress: {
        city: String,
        state: String,
        addressLine: String,
      },

      occupation: {
        type: String,
        companyOrCollege: String,
      },

      income: {
        monthlyIncome: Number,
      },
    },

    // OWNER DETAILS (OPTIONAL, SAFE)
    ownerDetails: {
      aadhaarNumber: String,

      contact: {
        mobile: String,
      },

      address: {
        city: String,
        state: String,
      },

      bankDetails: {
        accountNumber: String,
        ifsc: String,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
