var fs = require('fs');

try {
  fs.mkdirSync(__dirname + '/../test/fixtures/node_modules/linker/node_modules');
} catch (e) {}
process.chdir(__dirname + '/../test/fixtures/node_modules/linker/node_modules');
fs.unlinkSync('linked');
fs.symlinkSync('../../../linked', 'linked', 'dir');