var express = require('express');
var router = express.Router();

const asyncroute = require('../utils/asyncroute');
const urlservice = require('../services').urls;
const userservice = require('../services').user;
const authmiddleware = require('../utils/authmiddleware');


require('../utils/filelist')(__dirname).forEach(file => router.use(`/${file}`, require(`./${file}`)));

router.use(authmiddleware.userCheck());



router.get ('/', asyncroute(async (req, res, next) => {
  if (req.anonymous) {
    render('index', req, res, null);
  } else {
    res.redirect('myurls');
  }
}));

router.get ('/about', asyncroute(async (req, res, next) => {
  render('about', req, res, null);
}));

router.get ('/login', asyncroute(async (req, res, next) => {
  render('login', req, res, null, 'Login');
}));

router.get ('/register', asyncroute(async (req, res, next) => {
  render('register', req, res, null, 'Register');
}));

router.post('/login', asyncroute(async (req, res, next) => {

  var body = req.body;
  if (!body.email || !body.password) {
    render('login', req, res, null, 'Login', 'Please enter login and password');
    return;
  }

  try {
    var t = await userservice.login(body.email, body.password);
  } catch (e) {
    render('login', req, res, null, 'Login', e.message);
    return;
  }

  res.cookie('auth', t);
  res.redirect('/');

}));

router.post('/register', asyncroute(async (req, res, next) => {

  var body = req.body;
  if (!body.email || !body.password) {
    render('register', req, res, null, 'Register', 'Please enter login and password');
    return;
  }

  if (body.password != body.repeat) {
    render('register', req, res, null, 'Register', 'Passwords are not the same');
    return;
  }
  try {
    var t = await userservice.register(body.email, body.password);
  } catch (e) {
    render('register', req, res, null, 'Register', e.message);
    return;
  }

  res.cookie('auth', t);
  res.redirect('/myurls');

}));

router.get ('/logout', asyncroute(async (req, res, next) => {
  res.cookie('auth' , '', {expire : new Date(0)});
  res.redirect('/');
}));

router.use ('/myurls', authmiddleware.authorize());
router.get ('/myurls', asyncroute(async (req, res, next) => {

  var model = {};
  model.urls = (await urlservice.listAll(req.user._id))
    .map((item, index) => ({
      index: (index + 1),
      item: {
        id: item._id,
        trimmedurl: ( (item.url.length > 25) ? (item.url.substring(0,25) + '...') : item.url ),
        name: item.name,
        url: item.url,
        date: item.date.toLocaleDateString(),
        short: `${req.hostname}/go/${item._id}`
      }
    }));

  render('myurls', req, res, model, 'My urls');

}));

router.use ('/add', authmiddleware.authorize());
router.post('/add', asyncroute(async (req, res, next) => {

  var body = req.body;
  if (!body.url) {
    render('myurls', req, res, model, 'My urls', 'Url is required');
    return;
  }
  body.name = body.name ? body.name : null;
  var t = await urlservice.addNew(body.url, req.user._id, body.name);

  res.redirect('/myurls');

}));


router.get ('/go/:id', asyncroute(async (req, res, next) => {

  var result = await urlservice.getById(req.params.id);
  if (!result) {
    res.status(404).send('Not found');
    return;
  }
  res.redirect(result.url);

}));



function render(view, req, res, model, title, error) {
  title = (!title) ? 'Url Shortener' : (title + ' | Url Shortener');
  return res.render(view, { page: { title: title, user : req.user, anonymous: req.anonymous, error: error }, model: model });
}

module.exports = router;
