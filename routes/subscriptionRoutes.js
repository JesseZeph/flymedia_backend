const express = require('express');

const router = express.Router();

const controller = require('../controller/subscriptionController');
const { verifySuperAdmin } = require('../middleware/verifyToken');

router.get('/', controller.getAllSubscriptions);

router.post('/', verifySuperAdmin, controller.createNewSubsriptions);

router.put('/', verifySuperAdmin, controller.editSubscriptions);

router.delete('/', verifySuperAdmin, controller.deleteSubscriptions);

module.exports = router;
