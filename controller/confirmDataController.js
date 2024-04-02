const jwt = require('jsonwebtoken');
const Company = require('../models/VerifyCompany');
require('dotenv').config();

const confirmValidToken = async (req, res) => {
  const token = req.body.token;
  try {
    jwt.verify(token, process.env.JWT_SEC, async function (err, user) {
      if (err && err.name == 'TokenExpiredError') {
        return res.status(200).json({
          is_valid: false,
          message: 'Session expired. Sign in again.',
        });
      }
    });

    return res.status(200).json({ is_valid: true, message: 'Token valid.' });
  } catch (error) {
    return res
      .status(500)
      .json({ is_valid: false, message: 'An error occured.' });
  }
};

const confirmCompanyVerified = async (req, res) => {
  const userId = req.body.user_id;
  try {
    const company = await Company.findOne({ userId: userId }).exec();
    if (company) {
      const message = company.isVerified
        ? 'Company verified.'
        : 'Company not verified.';
      return res
        .status(200)
        .json({
          is_verified: company.isVerified,
          message: message,
          company: company,
        });
    }
    return res
      .status(404)
      .json({ is_verified: false, message: 'No company found for this user.' });
  } catch (error) {
    res.status(500).json({ is_verified: false, message: 'An error occured.' });
  }
};

module.exports = {
  confirmValidToken,
  confirmCompanyVerified,
};
