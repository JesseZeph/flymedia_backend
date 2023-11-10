const router = require('express').Router();
const nicheController = require('../controller/nicheController');
const {verifyInfluencer} = require('../middleware/verifyToken')


router.get('/', verifyInfluencer, nicheController.getNiches);

module.exports = router;
