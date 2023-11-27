const router = require('express').Router();
const userController = require('../controller/userController');
const {verifyAndAuthorization} = require('../middleware/verifyToken')


router.get('/:id', userController.getUser);
router.delete('/',userController.deleteUser);
router.put('/',userController.updateUser);

module.exports = router;