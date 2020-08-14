const { Router } = require('express');

const auth = require('./auth');
const docs = require('./docs');

const { getTimetable } = require("../controllers/timetable.controller");

const router = Router();


router.get('/timetable-list', getTimetable);
router.use('/auth', auth)
router.use('/docs', docs)

module.exports = router;
