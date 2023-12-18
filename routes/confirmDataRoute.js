const confirmDataController = require('../controller/confirmDataController');

const router = require('express').Router();

router.post('/token', confirmDataController.confirmValidToken);
router.post('/company', confirmDataController.confirmCompanyVerified);

module.exports = router;
