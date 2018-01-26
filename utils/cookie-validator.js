const hmac_secret = 'followthedamntraincj';
const crypto = require('crypto');

function toBase64(obj) {
  return new Buffer(JSON.stringify(obj)).toString('base64');
}

function fromBase64(str) {
  return JSON.parse(new Buffer(str, 'base64').toString());
}


module.exports = {
  generate: (email, id) => {
    var payload = toBase64({
      email: email, id: id
    });
    var sig = crypto.createHmac('sha256', hmac_secret).update(payload).digest('base64');
    return `${payload}.${sig}`;
  },

  validate: (token) => {
    var splited = token.split('.');
    if (splited.length != 2) return null;
    var payload = fromBase64(splited[0]);
    var trueSig = crypto.createHmac('sha256', hmac_secret).update(splited[0]).digest('base64');
    if (splited[1] != trueSig) return null;

    return payload;
  }
};
