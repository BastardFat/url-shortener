const service = require('../services').user;

module.exports = {
  userCheck: () => { return (req, res, next) => {

    var auth = req.cookies.auth;
    service.validate(auth)
    .then(user => {
      req.user = user;
      req.anonymous = req.user == null;
      next();
    });


  };},

  authorize: () => { return (req, res, next) => {

    if (req.user == null) {
      res.status(403).send('Access denied');
      return;
    }
    next();

  };},

  onlyConfirmed: () => { return (req, res, next) => {

    if (!req.user.confirmed) {
      res.status(403).send('Only confirmed user has permissions for this action');
      return;
    }
    next();

  };}

}
