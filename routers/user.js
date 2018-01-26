var express = require('express');
var router = express.Router();

const asyncroute = require('../utils/asyncroute');
const service = require('../services').user;
const authmiddleware = require('../utils/authmiddleware');


router.use(authmiddleware.userCheck());


//POST {email, password}
router.post('/register', asyncroute(async (req, res, next) => {

  var body = req.body;
  if (!body.email || !body.password) {
    res.status(400).send('Bad request');
    return;
  }
  var t = await service.register(body.email, body.password);
  res.cookie('auth', t);
  res.send({ success: true });

}));


//POST {email, password}
router.post('/login', asyncroute(async (req, res, next) => {

  var body = req.body;
  if (!body.email || !body.password) {
    res.status(400).send('Bad request');
    return;
  }
  var t = await service.login(body.email, body.password);
  res.cookie('auth', t);
  res.send({ success: true });

}));


router.use ('/logout', authmiddleware.authorize());
router.post('/logout', asyncroute(async (req, res, next) => {

  res.cookie('auth' , '', {expire : new Date(0)});
  res.send({ success: true });

}));


router.use ('/info', authmiddleware.authorize());
router.get ('/info', asyncroute(async (req, res, next) => {

  delete req.user.hash;
  delete req.user.confirmationToken;
  req.user.created = new Date(req.user.created);
  res.send(req.user);

}));




module.exports = router;
