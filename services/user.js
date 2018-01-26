var express = require('express');
var router = express.Router();
const data = require('../data').urlshortener;
var crypto = require('crypto');
const validator = require('../utils/cookie-validator');

var service = {

  register: async (email, password) => {
    var hash = crypto.createHash('sha256').update(password).digest('base64');
    var user = {
      email: email,
      hash: hash,
      confirmed: false,
      confirmationToken: crypto.randomBytes(16).toString('hex'),
      created: Date.now()
    };
    var result = await data.execute('users', async (collection) => {
      return await collection.insert(user);
    });

    if(!result.ok) null;
    return validator.generate(user.email, result.insertedIds['0']);

  }

}


module.exports = service;
