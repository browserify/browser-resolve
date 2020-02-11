var fs = require('fs');

try {
  fs.mkdirSync(__dirname + '/../test/fixtures/node_modules/linker/node_modules');
} catch (e) {}
process.chdir(__dirname + '/../test/fixtures/node_modules/linker/node_modules');
try {
  fs.unlinkSync('linked');
} catch (e) {}
fs.symlinkSync('../../../linked', 'linked', 'dir');