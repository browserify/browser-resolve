var fs = require('fs');

process.chdir(__dirname + '/../test/fixtures/node_modules/linker/node_modules');
fs.unlinkSync('linked');
fs.symlinkSync('../../../linked', 'linked', 'dir');