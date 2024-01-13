const AppleAuth = require('apple-auth');
require('dotenv').config();

const callback = (request, response) => {
  const redirect = `intent://callback?${new URLSearchParams(
    request.body
  ).toString()}#Intent;package=${
    process.env.ANDROID_PACKAGE_IDENTIFIER
  };scheme=signinwithapple;end`;
  response.redirect(307, redirect);
};

const confirmAppleTokens = async (req, res) => {
  const tokens = req.body;
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
};
module.exports = {
  callback,
  confirmAppleTokens,
};
