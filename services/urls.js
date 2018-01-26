var express = require('express');
var router = express.Router();
const data = require('../data').urlshortener;

var service = {

  addNew: async (url) => {
    return await data.execute('urls', async (collection) => {
      return await collection.insert({url : url});
    });
  },
  
  listAll: async () => {
    return await data.execute('urls', async (collection) => {
      return await collection.find().toArray();
    });
  }

}


module.exports = service;
