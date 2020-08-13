const { Router } = require('express');

const {getTimetable} = require("../controllers/timetable.controller");

const router = Router();

router.get('/timetable-list', getTimetable);

module.exports = router;
