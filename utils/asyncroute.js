module.exports = (fn) =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch( err =>
      {
        console.log(err);
        if (err.message!=null && err.code!=null) {
          res.status(err.code).send(err.message);
        } else {
          res.status(500).send(err);
        }

        next();
      });
  };
