const fs = require('fs');

var filelist = (folder) => {
  return fs
    .readdirSync(folder)
    .filter(file => file != 'index.js' && file.endsWith('.js'))
    .map(file => file.slice(0, -3));
}

// var includer = (folder) => {
//   var tempModule = {};
//   filelist(folder).forEach( file => tempModule[file] = require(folder + file) );
//   return tempModule;
// }

module.exports = filelist;
