const router = require('express').Router();
const verifyCompanyController = require('../controller/verifyCompanyController');
const {verifyAndAuthorization, verifySuperAdmin, verifyAdmin, } = require('../middleware/verifyToken')


router.post('/', verifyAndAuthorization, verifyCompanyController.addCompany);
router.get('/:id', verifyAndAuthorization,  verifyCompanyController.getCompany);
router.patch('/:id', verifySuperAdmin, verifyCompanyController.verificationStatus);
router.get('/', verifyAdmin, verifySuperAdmin, verifyCompanyController.getAllCompany);

module.exports = router;