var express = require('express');
var router = express.Router();

const asyncroute = require('../utils/asyncroute');
const service = require('../services').urls;
const authmiddleware = require('../utils/authmiddleware');

router.use(authmiddleware.userCheck());

router.use ('/', authmiddleware.authorize());
router.get ('/', asyncroute(async (req, res, next) => {

  var list = await service.listAll(req.user._id);
  res.send(list);

}));

router.use ('/add', authmiddleware.authorize());
router.post('/add', async function(req, res) {

  var body = req.body;
  if (!body.url) {
    res.status(400).send('Bad request');
    return;
  }
  body.name = body.name ? body.name : null;

  var t = await service.addNew(body.url, req.user._id, body.name);
  res.send(t);

});

module.exports = router;
