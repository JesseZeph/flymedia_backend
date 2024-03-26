const User = require('../models/User');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');
const Company = require('../models/VerifyCompany');

async function sendVerificationCode(email, code, type) {
  const subject =
    type === 'email' ? 'Email Verification Code' : 'Password Reset Code';
  const body = `Your ${subject.toLowerCase()} is: ${code}`;

  const msg = {
    to: email,
    from: {
      email: 'bobcatzephyr@gmail.com',
      name: 'Flymedia',
    },
    subject: subject,
    text: body,
  };

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  try {
    await sgMail.send(msg);
    console.log(`${subject} sent successfully`);
  } catch (error) {
    console.error(`Error sending ${type} verification code`, error);
    throw error;
  }
}

async function createUserInDatabase(user, userType) {
  try {
    const newUser = new User({
      fullname: user.fullname,
      email: user.email,
      password: CryptoJS.AES.encrypt(
        user.password,
        process.env.SECRET
      ).toString(),
      userType: userType || 'Client',
    });

    newUser.verificationCode = newUser.generateVerificationCode();
    await newUser.save();

    sendVerificationCode(user.email, newUser.verificationCode, 'email');

    return newUser;
  } catch (error) {
    throw error;
  }
}

async function resetFirebasePassword(userMail, newPassword) {
  try {
    const record = await admin.auth().getUserByEmail(userMail);
    if (record) {
      const id = await record.getUid();
      const newRecord = await admin.auth().updateUser(id, {
        email: userMail,
        password: newPassword,
      });
    }
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createUser: async (req, res) => {
    const user = req.body;
    const existingUser = await User.findOne({ email: user.email });

    if (existingUser) {
      return res
        .status(400)
        .json({ status: false, error: 'User already exists.' });
    }

    try {
      const newUser = await createUserInDatabase(user, user.userType);
      res.status(201).json({ status: true, user: newUser });
    } catch (error) {
      console.error('Error saving user to MongoDB', error);
      res.status(500).json({ status: false, error: error.message });
    }
  },

  createInfluencer: async (req, res) => {
    const influencer = req.body;
    const existingUser = await User.findOne({ email: influencer.email });

    if (existingUser) {
      return res
        .status(400)
        .json({ status: false, error: 'User already exists.' });
    }

    try {
      const newInfluencer = await createUserInDatabase(
        influencer,
        'Influencer'
      );

      res.status(201).json({ status: true, user: newInfluencer });
    } catch (error) {
      console.error('Error saving influencer to MongoDB', error);
      res
        .status(500)
        .json({ status: false, error: 'Error creating influencer' });
    }
  },

  createAdmin: async (req, res) => {
    const flyAdmin = req.body;

    const existingUser = await User.findOne({ email: flyAdmin.email });

    if (existingUser) {
      return res
        .status(400)
        .json({ status: false, error: 'User already exists.' });
    }

    try {
      // Ensure that the requesting user is a SuperAdmin
      const requestingUser = await User.findById(req.user.id);

      if (!requestingUser || requestingUser.userType !== 'SuperAdmin') {
        return res.status(403).json({
          status: false,
          error: 'Unauthorized. Only SuperAdmins can create Admins.',
        });
      }

      const newAdmin = await createUserInDatabase(flyAdmin, 'Admin');
      res.status(201).json({ status: true, user: newAdmin });
    } catch (error) {
      console.error('Error saving admin to MongoDB', error);
      res.status(500).json({ status: false, error: 'Error creating admin' });
    }
  },

  createSuperAdmin: async (req, res) => {
    const superAdmin = req.body;

    const existingUser = await User.findOne({ email: superAdmin.email });

    if (existingUser) {
      return res
        .status(400)
        .json({ status: false, error: 'User already exists.' });
    }

    try {
      const newSuperAdmin = await createUserInDatabase(
        superAdmin,
        'SuperAdmin'
      );
      res.status(201).json({ status: true, user: newSuperAdmin });
    } catch (error) {
      console.error('Error saving super admin to MongoDB', error);
      res
        .status(500)
        .json({ status: false, error: 'Error creating super admin' });
    }
  },

  loginUser: async (req, res) => {
    try {
      const user = await User.findOne(
        { email: req.body.email },
        { __v: 0, updatedAt: 0, createdAt: 0, email: 0 }
      );
      const userType = req.body.user_type;

      if (!user || (user.userType != userType && !user.userType)) {
        return res
          .status(404)
          .json({ status: false, message: 'Account not found.' });
      }

      const decryptedPasswordBytes = CryptoJS.AES.decrypt(
        user.password,
        process.env.SECRET
      );
      const decrypted = decryptedPasswordBytes.toString(CryptoJS.enc.Utf8);

      if (decrypted !== req.body.password) {
        return res
          .status(400)
          .json({ status: false, message: 'Wrong email or password' });
      }

      const userToken = jwt.sign(
        {
          id: user._id,
          userType: user.userType,
          uid: user.uid,
        },
        process.env.JWT_SEC,
        { expiresIn: '21d' }
      );

      // Filter db to send back to user
      const { password, ...others } = user._doc;

      const userCompany = await Company.findOne({ userId: user._id });

      res.status(200).json({
        ...others,
        userToken,
        userType: userType ?? user.userType,
        company: userCompany ? userCompany : {},
      });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  verifyUserEmail: async (req, res) => {
    try {
      const { email, verificationCode } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          message: 'User not found',
        });
      }

      if (user.isVerified) {
        return res.status(400).json({
          message: 'Email already verified',
        });
      }

      if (user.verificationCode !== verificationCode) {
        return res.status(400).json({
          message: 'Invalid verification code',
        });
      }

      // Code is valid - proceed with verification
      user.isVerified = true;
      await user.save();

      res.status(200).json({
        message: 'Email verified successfully',
      });
    } catch (error) {
      res.status(500).json({
        message: 'Internal server error',
      });
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;

      // Find the user by email
      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ status: 'Failed', message: "Email doesn't exist" });
      }

      // Generate and save a new password reset verification code
      const resetVerificationCode =
        user.generatePasswordResetVerificationCode();
      user.passwordResetVerificationCode = resetVerificationCode;
      user.passwordResetExpires = Date.now() + 300000; // 5 minutes in milliseconds
      await user.save({ validateBeforeSave: false });

      // Send the verification code to the user
      sendVerificationCode(user.email, resetVerificationCode, 'password');

      res.status(200).json({
        status: 'Success',
        message: 'Password reset code sent to your email',
      });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  },

  resendVerificationCode: async (req, res) => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        console.log('User not found');
        return res.status(404).json({
          message: 'User not found',
        });
      }

      const newVerificationCode = user.generateVerificationCode();
      user.verificationCode = newVerificationCode;
      await user.save();

      sendVerificationCode(user.email, newVerificationCode);

      console.log('Verification code resent successfully:', user.email);
      res.status(200).json({
        message: 'Verification code resent successfully',
      });
    } catch (error) {
      console.error('Error resending verification code:', error);
      res.status(500).json({
        message: 'Internal server error',
      });
    }
  },

  verifyPasswordResetCode: async (req, res) => {
    try {
      const { verificationCode } = req.body;

      // Find the user by verification code
      const user = await User.findOne({
        passwordResetVerificationCode: verificationCode,
        passwordResetExpires: { $gt: Date.now() }, // Check if the code has not expired
      });

      if (!user) {
        console.log(
          'Invalid verification code or code has expired:',
          verificationCode
        );
        return res.status(400).json({
          message: 'Invalid verification code or code has expired',
        });
      }

      return res.status(200).json({
        message: 'Verification code is valid',
      });
    } catch (error) {
      console.error('Error verifying password reset code:', error);
      res.status(500).json({
        message: 'Internal server error',
      });
    }
  },

  changePassword: async (req, res) => {
    try {
      const { email, newPassword } = req.body;

      if (!newPassword || newPassword.length == 0) {
        return res.status(400).json({
          message: 'New password is missing in the request body',
        });
      }

      if (!email || email.length == 0) {
        return res.status(400).json({
          message: 'Email is missing in the request body',
        });
      }

      // Find the user by email
      const user = await User.findOne({ email });

      if (!user) {
        console.log('User not found:', email);
        return res.status(404).json({
          message: 'User not found',
        });
      }

      // Update the password
      user.password = CryptoJS.AES.encrypt(
        newPassword,
        process.env.SECRET
      ).toString();

      user.passwordChangedDate = Date.now();
      await user.save();

      resetFirebasePassword(email, newPassword);

      // Generate a new JWT token for the user
      const userToken = jwt.sign(
        {
          id: user._id,
          userType: user.userType,
          email: user.email,
        },
        process.env.JWT_SEC,
        { expiresIn: '21d' }
      );

      const { password, email: userEmail, ...others } = user._doc;

      res.status(200).json({
        ...others,
        userToken,
        message: 'Password changed successful',
      });
    } catch (error) {
      res.status(500).json({
        message: 'Internal server error',
      });
    }
  },
};
