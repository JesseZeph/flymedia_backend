const express = require('express');
const AccountController = require('../controller/accountController');
const router = express.Router();

const { verifyInfluencer } = require('../middleware/verifyToken');

router.get('/:id', verifyInfluencer, AccountController.fetchAccount);
router.post('/', verifyInfluencer, AccountController.addAccount);
router.put('/', verifyInfluencer, AccountController.editAccount);
router.delete('/', verifyInfluencer, AccountController.deleteAccount);

module.exports = router;
