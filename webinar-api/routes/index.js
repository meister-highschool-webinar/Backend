const { Router } = require('express');

const {getTimetable} = require("../controllers/timetable.controller");

const router = Router();
const auth = require('./auth');
const docs = require('./docs');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
router.get('/timetable-list', getTimetable);
router.use('/auth', auth)
router.use('/docs', docs)

module.exports = router;
