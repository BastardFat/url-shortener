var express = require('express');
var router = express.Router();
const data = require('../data').urlshortener;

const urlService = require('../services').urls;


router.get('/', async function(req, res) {
  var t = await urlService.listAll();
  res.send(t);
});

router.get('/add', async function(req, res) {
  var t = await urlService.addNew(req.query.url);
  res.send(t);
});

module.exports = router;
