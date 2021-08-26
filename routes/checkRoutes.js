const { Router } = require('express');
const checkController = require('../controllers/checkController.js');


const router = Router();

router.get('/home', checkController.status_get);
router.get('/addcheck', checkController.addcheck_get);
router.post('/addcheck', checkController.addcheck_post);
router.get('/dashboard', checkController.dashboard_get);
router.get('/report', checkController.report_get)
module.exports = router;