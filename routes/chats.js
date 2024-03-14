const express = require('express');
const controller = require('../controller/chats');
const groupController = require('../controller/groupChat');
const { verifyAndAuthorization } = require('../middleware/verifyToken');

const router = express.Router();

router.get('/groups', verifyAndAuthorization, groupController.fetchChats);
router.get('/', verifyAndAuthorization, controller.fetchAllChats);
router.get('/single', verifyAndAuthorization, controller.fetchSingleChat);
router.post(
  '/groups/status',
  verifyAndAuthorization,
  groupController.updateChatStatus
);
router.post('/status', verifyAndAuthorization, controller.updateChatStatus);
router.post('/', verifyAndAuthorization, controller.addChat);
router.put('/groups', verifyAndAuthorization, groupController.updateChat);
router.put('/', verifyAndAuthorization, controller.updateChat);
router.delete('/', verifyAndAuthorization, controller.deleteChat);

module.exports = router;
