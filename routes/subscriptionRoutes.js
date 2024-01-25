const express = require('express');

const router = express.Router();

const controller = require('../controller/subscriptionController');
const { verifyAdmin } = require('../middleware/verifyToken');

router.get('/', controller.getAllSubscriptions);

router.post('/', verifyAdmin, controller.createNewSubsriptions);

router.put('/', verifyAdmin, controller.editSubscriptions);

router.delete('/', verifyAdmin, controller.deleteSubscriptions);

module.exports = router;
