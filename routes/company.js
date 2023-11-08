const router = require('express').Router();
const companyController = require('../controller/companyController');
const {verifyAndAuthorization, verifySuperAdmin, verifyAdmin, } = require('../middleware/verifyToken')


router.post('/', verifyAndAuthorization, companyController.addCompany);
router.get('/:id', verifySuperAdmin,  companyController.getCompany);
router.patch('/:id', verifySuperAdmin, companyController.verificationStatus);
router.get('/', verifyAdmin, verifySuperAdmin, companyController.getAllCompany);


module.exports = router;