const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    companyHq: { type: String, required: true },
    website: { type: String, required: true },
    companyEmail: { type: String, required: true },
    memberContact: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    // campaignsInMonth: { type: Number, default: 0 },
    // subscription: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Subscription',
    //   default: null,
    // },
    // expiry: {
    //   type: Date,
    //   default: null,
    // },
  },
  { timestamps: true }
);

module.exports = mongoose.model('VerifyCompany', CompanySchema);
