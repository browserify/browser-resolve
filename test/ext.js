var assert = require('assert');
var resolve = require('../');

var fixtures_dir = __dirname + '/fixtures';

test('module to implicit extension', function(done) {
    var opts = { filename: fixtures_dir + '/node_modules/module-o/main.js' }
    resolve('module-a', opts, function(err, path) {
        assert.ifError(err);
        assert.equal(path, require.resolve('./fixtures/node_modules/module-o/x.js'));
        done();
    });
});

test('implicit extension to implicit extension', function(done) {
    var opts = { filename: fixtures_dir + '/node_modules/module-p/main.js' }
    resolve('./z.js', opts, function(err, path) {
        assert.ifError(err);
        assert.equal(path, require.resolve('./fixtures/node_modules/module-p/x.js'));
        done();
    });
});

test('implicit extension to implicit extension', function(done) {
    var opts = { filename: fixtures_dir + '/node_modules/module-p/main.js' }
    resolve('./z', opts, function(err, path) {
        assert.ifError(err);
        assert.equal(path, require.resolve('./fixtures/node_modules/module-p/x.js'));
        done();
    });
});

test('explicit extension to explicit extension', function(done) {
    var opts = { filename: fixtures_dir + '/node_modules/module-q/main.js' }
    resolve('./z.js', opts, function(err, path) {
        assert.ifError(err);
        assert.equal(path, require.resolve('./fixtures/node_modules/module-q/x.js'));
        done();
    });
});

test('implicit extension to explicit extension', function(done) {
    var opts = { filename: fixtures_dir + '/node_modules/module-r/main.js' }
    resolve('./z.js', opts, function(err, path) {
        assert.ifError(err);
        assert.equal(path, require.resolve('./fixtures/node_modules/module-r/x.js'));
        done();
    });
});

test('module implicit extension to explicit extension', function(done) {
    var opts = { filename: fixtures_dir + '/node_modules/module-s/main.js' }
    resolve('whatever/z.js', opts, function(err, path) {
        assert.ifError(err);
        assert.equal(path, require.resolve('./fixtures/node_modules/module-s/x.js'));
        done();
    });
});

test('module implicit extension to explicit extension', function(done) {
    var opts = { filename: fixtures_dir + '/node_modules/module-s/main.js' }
    resolve('whatever/z', opts, function(err, path) {
        assert.ifError(err);
        assert.equal(path, require.resolve('./fixtures/node_modules/module-s/x.js'));
        done();
    });
});

