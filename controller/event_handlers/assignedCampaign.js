const Template = require('../../utils/mailHandler/templates/assignedCampaign');
const Mailer = require('../../utils/mailHandler/mailer');

const sendMail = (influencerEmail, influencerName, campaignTitle) => {
  try {
    Mailer.sendMail(
      influencerEmail,
      Template(influencerName, campaignTitle),
      'New Campaign Assigned'
    );
  } catch (error) {
    console.log({ error });
  }
};

module.exports = { sendMail };
