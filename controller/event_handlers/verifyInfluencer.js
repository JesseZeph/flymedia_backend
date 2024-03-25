const Template = require('../../utils/mailHandler/templates/verifyInfluencer');
const Mailer = require('../../utils/mailHandler/mailer');

const sendMail = (influencerEmail, influencerName, influencerImage) => {
  try {
    Mailer.sendMail(
      influencerEmail,
      Template(influencerName, influencerImage),
      'Profile Verified'
    );
  } catch (error) {
    console.log({ error });
  }
};

module.exports = { sendMail };
