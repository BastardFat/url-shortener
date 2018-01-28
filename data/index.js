const MongoClient = require('mongodb').MongoClient;

class Database {
  constructor(connectionUrl, databaseName) {
    this.connectionUrl = connectionUrl;
    this.dbName = databaseName;
  }

  async execute(collectionName, action) {
    var client = await MongoClient.connect(this.connectionUrl);
    var db = client.db(this.dbName);
    var result = await action(db.collection(collectionName));
    client.close();
    return result;
  }

}

module.exports = {
  urlshortener: new Database(`mongodb://${process.env.DATABASE_USER || "admin"}:${process.env.DATABASE_PASSWORD || "admin"}@ds215208.mlab.com:15208/url-shortener`, 'url-shortener')
};
