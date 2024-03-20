const sgMail = require('@sendgrid/mail');

async function sendMail(receiverMail, mailBody, mailSubject) {
  const msg = {
    to: receiverMail,
    from: {
      email: 'bobcatzephyr@gmail.com',
      name: 'Flymedia',
    },
    subject: mailSubject,
    // text: body,
    html: mailBody,
  };

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error(`Error sending ${mailSubject}`, error);
  }
}

module.exports = { sendMail };
