const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: { type: String, required: true, unique: true },

  password: { type: String, required: true },

  role: {
    type: String,
    enum: ["owner", "tenant"],
    required: true,
  },

  // 👇 TENANT DETAILS (ONLY IF ROLE = tenant)
  tenantDetails: {
    aadhaarNumber: String,
    panNumber: String,

    permanentAddress: {
      addressLine: String,
      city: String,
      state: String,
      pincode: String,
    },

    contact: {
      primaryMobile: String,
      alternateMobile: String,
      emergencyContactName: String,
      emergencyContactNumber: String,
    },

    occupation: {
      type: String, // Working / Student
      companyOrCollege: String,
      designationOrCourse: String,
      officeOrCollegeAddress: String,
    },

    income: {
      monthlyIncome: Number,
    },

    rentalHistory: {
      previousLandlordName: String,
      previousLandlordContact: String,
      reasonForLeaving: String,
    },

    familyDetails: {
      numberOfOccupants: Number,
      details: String,
    },

    policeVerification: {
      completed: { type: Boolean, default: false },
    },
  },
});

module.exports = mongoose.model("User", userSchema);
