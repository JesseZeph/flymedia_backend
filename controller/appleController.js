const AppleAuth = require('apple-auth');
require('dotenv').config();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');

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
const callback = (request, response) => {
  const redirect = `intent://callback?${new URLSearchParams(
    request.body
  ).toString()}#Intent;package=${
    process.env.ANDROID_PACKAGE_IDENTIFIER
  };scheme=signinwithapple;end`;
  response.redirect(307, redirect);
};

const signUpApple = async (request, response) => {
  const requestParams = request.body;
  const auth = new AppleAuth(
    {
      // use the bundle ID as client ID for native apps, else use the service ID for web-auth flows
      // https://forums.developer.apple.com/thread/118135
      client_id:
        requestParams.use_bundle === 'true'
          ? process.env.BUNDLE_ID
          : process.env.SERVICE_ID,
      team_id: process.env.TEAM_ID,
      redirect_uri:
        'https://flymediabackend-production.up.railway.app/callbacks/sign_up_with_apple', // does not matter here, as this is already the callback that verifies the token after the redirection
      key_id: process.env.KEY_ID,
    },
    process.env.KEY_CONTENTS.replace(/\|/g, '\n'),
    'text'
  );

  const accessToken = await auth.accessToken(requestParams.auth_code);

  const idToken = jwt.decode(accessToken.id_token);

  // const userID = idToken.sub;

  // `userEmail` and `userName` will only be provided for the initial authorization with your app
  //   const userEmail = idToken.email;
  //   const userName = `${request.query.firstName} ${request.query.lastName}`;
  if (requestParams.is_login) {
    try {
      const user = await User.findOne({
        appleUid: requestParams.user_identifier,
      });

      const userType = requestParams.user_type;

      if (!user || user.userType != userType) {
        return res
          .status(404)
          .json({ status: false, message: 'Account not found.' });
      }

      const decryptedPasswordBytes = CryptoJS.AES.decrypt(
        user.password,
        process.env.SECRET
      );
      const decrypted = decryptedPasswordBytes.toString(CryptoJS.enc.Utf8);

      if (decrypted !== requestParams.user_identifier) {
        return res
          .status(400)
          .json({ status: false, message: 'Account not found.' });
      }

      const userToken = jwt.sign(
        {
          id: user._id,
          userType: user.userType,
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
        company: userCompany ? userCompany : {},
      });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  } else {
    try {
      const newUser = new User({
        fullname: requestParams.full_name,
        email: requestParams.email,
        password: CryptoJS.AES.encrypt(
          requestParams.user_identifier,
          process.env.SECRET
        ).toString(),
        userType: requestParams.user_type || 'Client',
        appleUid: requestParams.user_identifier,
      });

      newUser.verificationCode = newUser.generateVerificationCode();
      await newUser.save();

      sendVerificationCode(newUser.email, newUser.verificationCode, 'email');

      return response.status(201).json({ status: true, user: newUser });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  }
};

module.exports = {
  callback,
  signUpApple,
};
