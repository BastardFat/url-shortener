var express = require('express');
var router = express.Router();
const data = require('../data').urlshortener;

var service = {

  listAll: async () => {
    return await data.execute('numbers', async (collection) => {
      return await collection.find().toArray();
    });
  },

  listAllGreaterThan: async (value) => {
    return await data.execute('numbers', async (collection) => {
      var query = { "num": { $gt: value } };
      return await collection.find(query).toArray();
    });
  },


}


module.exports = service;
