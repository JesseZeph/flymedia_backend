const router = require('express').Router();
const JobSpecificationController = require('../controller/jobSpecController');
const {verifyAndAuthorization} = require('../middleware/verifyToken')


router.post('/', verifyAndAuthorization, JobSpecificationController.addJobSpecification);
router.get('/:id',  verifyAndAuthorization,JobSpecificationController.getJobSpecification);
router.get('/', verifyAndAuthorization ,JobSpecificationController.getAllJobsSpecification);


module.exports = router;