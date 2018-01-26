var mod = {}

require('../utils/filelist')(__dirname)
  .forEach(file => mod[file] = require(`./${file}`));


module.exports = mod;
