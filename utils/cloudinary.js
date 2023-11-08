const cloudinary = require('cloudinary').v2          
cloudinary.config({ 
  cloud_name: 'dr5cb7y6k', 
  api_key: '414377457857759', 
  api_secret: 'K9eIXLRitRHfshkStYarBeAV1gE' 
});

module.exports = cloudinary;