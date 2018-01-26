var express = require('express');
var router = express.Router();
const data = require('../data').urlshortener;

const service = require('../services').user;

router.post('/register', async function(req, res) {
  var body = req.body;
  var t = await service.register(body.email, body.password);
  if (!t){
    res.send('error');
  }
  res.cookie('auth', t);
  res.send('yeap');
});

module.exports = router;
