const express = require('express');

const router = express.Router();

const controller = require('../controller/subscriptionController');
// const {  } = require('../middleware/verifyToken');

router.get('/', controller.getAllSubscriptions);

router.post('/',  controller.createNewSubsriptions);

router.put('/',  controller.editSubscriptions);

router.delete('/', controller.deleteSubscriptions);

module.exports = router;
