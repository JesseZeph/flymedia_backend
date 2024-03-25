const template = (influencerName, imageUrl) => {
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
          Congratulations! Your profile has been verified
          <span id="title">"${imageUrl}"</span>
        </p>
        <p class="info">
          You can now start applying for campaigns
        </p>
      </body>
    </html>
    `;
  };
  
  module.exports = template;
  