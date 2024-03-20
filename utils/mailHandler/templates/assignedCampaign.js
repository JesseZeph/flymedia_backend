const template = (influencerName, campaignTitle) => {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Flymedia Notification</title>
      <style>
        .intro {
          font-weight: bold;
          font-size: 14;
          margin-bottom: 30px;
        }
  
        #title {
          color: #04c1c4;
          font-weight: 800;
        }
        .info {
          font-size: 16;
          font-weight: 500;
        }
      </style>
    </head>
    <body>
      <p class="intro">Hi ${influencerName},</p>
      <p class="info">
        Congratulations! You have been sucessfully assigned to a new campaign
        <span id="title">"${campaignTitle}"</span>
      </p>
      <p class="info">
        Log into your account to accept or reject this opportunity and begin the
        collaboration.
      </p>
    </body>
  </html>
  `;
};

module.exports = template;
