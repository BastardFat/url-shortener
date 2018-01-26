var express = require('express');
var router = express.Router();
const data = require('../data').urlshortener;
var crypto = require('crypto');
const validator = require('../utils/cookie-validator');

const ObjectID = require('mongodb').ObjectID;

var service = {};

service.register = async (email, password) => {
  var hash = crypto.createHash('sha256').update(password).digest('base64');
  var user = {
    email: email,
    hash: hash,
    confirmed: false,
    confirmationToken: crypto.randomBytes(16).toString('hex'),
    created: new Date()
  };

  var result = await data.execute('users', async (collection) => {
    var existing = await collection.findOne( { email: email } );
    if (existing != null) {
      throw { code: 409, message: 'User already exists' };
    }
    return await collection.insertOne(user);
  });
  return validator.generate(user.email, result.insertedId);
};


service.login = async (email, password) => {
  var hash = crypto.createHash('sha256').update(password).digest('base64');
  var query = { email: email, hash: hash };

  var result = await data.execute('users', async (collection) => {
    var user = await collection.findOne( query );
    if (!user) {
      throw { code: 401, message: 'Invalid email or password' };
    }
    return user;
  });
  return validator.generate(result.email, result._id);
};


service.validate = async (token) => {
  var res = validator.validate(token);
  if (res == null) return null;
  var user = await data.execute('users', async (collection) => {
    return await collection.findOne( { _id: ObjectID(res.id) } );
  });
  if (user == null) return null;
  return user;
};



module.exports = service;
