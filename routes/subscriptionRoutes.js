const express = require('express');

const router = express.Router();

const controller = require('../controller/subscriptionController');
const { verifyAdmin, verifyClient } = require('../middleware/verifyToken');

router.get('/', controller.getAllSubscriptions);
router.get('/:id', controller.fetchUserSubscription);

router.post('/', verifyAdmin, controller.createNewSubsriptions);
router.post('/verify', verifyClient, controller.verifySubscription);

router.put('/', verifyAdmin, controller.editSubscriptions);

router.delete('/', verifyAdmin, controller.deleteSubscriptions);

module.exports = router;
