const Template = require('../../utils/mailHandler/templates/verifyCompany');
const Mailer = require('../../utils/mailHandler/mailer');

const sendMail = (clientEmail, companyName, companyAddress) => {
  try {
    Mailer.sendMail(
      clientEmail,
      Template(companyName, companyAddress),
      'Company Verified'
    );
  } catch (error) {
    console.log({ error });
  }
};

module.exports = { sendMail };
