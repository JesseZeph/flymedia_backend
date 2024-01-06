const router = require('express').Router();
const verifyCompanyController = require('../controller/verifyCompanyController');
const {verifyAndAuthorization, verifySuperAdmin, verifyAdmin, } = require('../middleware/verifyToken')


router.post('/', verifyAndAuthorization, verifyCompanyController.addCompany);
router.get('/company/:id', verifyCompanyController.getCompany);
router.get('/', verifyCompanyController.getAllCompany);
router.get('/totalCompanies', verifyCompanyController.getTotalCompanies);
router.get('/pendingVerification', verifyCompanyController.
getAllUnverifiedCompanies);
router.get('/totalPending', verifyCompanyController.countUnverified);
router.post('/:id', verifySuperAdmin, verifyCompanyController.verificationStatus);


module.exports = router;