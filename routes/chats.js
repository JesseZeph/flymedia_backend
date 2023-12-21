const express = require('express');
const controller = require('../controller/chats');
const { verifyAndAuthorization } = require('../middleware/verifyToken');

const router = express.Router();

router.get('/', verifyAndAuthorization, controller.fetchAllChats);
router.get('/single', verifyAndAuthorization, controller.fetchSingleChat);
router.post('/', verifyAndAuthorization, controller.addChat);
router.put('/', verifyAndAuthorization, controller.updateChat);
router.delete('/', verifyAndAuthorization, controller.deleteChat);

module.exports = router;
