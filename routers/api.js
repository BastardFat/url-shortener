var express = require('express');
var router = express.Router();
const data = require('../data').urlshortener;

const service = require('../services');


router.get('/:num', async function(req, res) {
  var t = await service.listAllGreaterThan(parseInt(req.params.num));
  res.send(t);
});





module.exports = router;
