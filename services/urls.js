var express = require('express');
var router = express.Router();
const ObjectID = require('mongodb').ObjectID;

const data = require('../data').urlshortener;

var service = {};

service.addNew = async (url, userId, name) => {
  var doc = {
    name: name,
    url : url,
    userId : userId,
    date : new Date()
  };
  var result = await data.execute('urls', async (collection) => {
    return await collection.insertOne(doc);
  });
  doc._id = result.insertedId;
  return doc;
};

service.listAll = async (userId) => {
  return await data.execute('urls', async (collection) => {
    return await collection.find({ userId : userId }).sort({ date: -1 }).toArray();
  });
};

service.getById = async (id) => {
  return await data.execute('urls', async (collection) => {
    return await collection.findOne({ _id : ObjectID(id) });
  });
};

module.exports = service;
