const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    companyHq: { type: String, required: true },
    website: { type: String, required: false },
    companyEmail: { type: String, required: true },
    phoneContact: { type: String, required: true },
    contactPerson: { type: String, required: false },
    companyDescription: { type: String, required: true },
    logoImage: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('VerifyCompany', CompanySchema);
