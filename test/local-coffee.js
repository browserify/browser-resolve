var assert = require('assert');
var resolve = require('../');

var fixtures_dir = __dirname + '/fixtures-coffee';

describe('local-coffee', function() {
    // resolve needs a parent filename or paths to be able to lookup files
    // we provide a phony parent file
    var parent = {
        filename: fixtures_dir + '/phony.js',
        extensions: ['.js', '.coffee']
    };

    test('async', function(done) {
        resolve('./foo', parent, function(err, path) {
            assert.ifError(err);
            assert.equal(path,
                require.resolve('./fixtures-coffee/foo.coffee'));
            done();
        });
    });

    test('sync', function() {
        assert.equal(resolve.sync('./foo', parent),
            require.resolve('./fixtures-coffee/foo.coffee'));
    });
});
