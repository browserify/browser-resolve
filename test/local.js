var assert = require('assert');
var resolve = require('../');

var fixtures_dir = __dirname + '/fixtures';

describe('local', function() {
    var opts = { filename: fixtures_dir + '/phony.js' };
    // resolve needs a parent filename or paths to be able to lookup files
    // we provide a phony parent file

    test('async', function(done) {
        resolve('./foo', opts, function(err, path) {
            assert.ifError(err);
            assert.equal(path, require.resolve('./fixtures/foo'));
            done();
        });
    });

    test('sync', function() {
        assert.equal(resolve.sync('./foo', opts),
            require.resolve('./fixtures/foo'));
    });
});

