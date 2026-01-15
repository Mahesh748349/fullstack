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



const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ["owner", "tenant"] },

    tenantDetails: {
      aadhaarNumber: String,
      contact: {
        primaryMobile: String,
        alternateMobile: String,
        emergencyContact: String,
      },
      permanentAddress: {
        city: String,
        state: String,
      },
      occupation: {
        type: String, // Student / Working
        companyOrCollege: String,
      },
      income: {
        monthlyIncome: Number,
      },
    },

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


