var resolve = require('../');
var parent = { filename: __dirname + '/skip/main.js' };
resolve('canvas', parent, function(err, path) {
    console.log(path);
});
