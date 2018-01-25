var express = require('express');
var router = express.Router();

require('../utils/filelist')(__dirname).forEach(file => router.use(`/${file}`, require(`./${file}`)));

router.get('/', function(req, res) {
  res.send();
});

router.get('/about', function(req, res) {
  res.send('about page');
});

module.exports = router;
