const template = (companyName) => {
    return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Flymedia Notification</title>
        <style>
          * {
            background-color: #fff;
          }
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
        <p class="intro">Hi ${companyName},</p>
        <p class="info">
          Congratulations! Your company has been verified
        </p>
        <p class="info">
          You can now start applying posting campaigns
        </p>
      </body>
    </html>
    `;
  };
  
  module.exports = template;
  