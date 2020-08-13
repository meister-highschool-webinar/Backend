let express = require('express');
let router = express.Router();
let auth = require('./auth');
let docs = require('./docs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.use('/auth', auth)
router.use('/docs', docs)

module.exports = router;
