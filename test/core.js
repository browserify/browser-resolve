// test loading core modules
var assert = require('assert');
var resolve = require('../');

var shims = {
    events: 'foo'
};

describe('shim found', function() {
    var opts = { modules: shims };

    test('async', function(done) {
        resolve('events', opts, function(err, path) {
            assert.ifError(err);
            assert.equal(path, 'foo');
            done();
        });
    });

    test('sync', function() {
        assert.equal(resolve.sync('events', opts), 'foo');
    });
});

describe('core shim not found', function() {
    test('async', function(done) {
        resolve('http', {}, function(err, path) {
            assert.ifError(err);
            assert.equal(path, 'http');
            done();
        });
    });

    test('sync', function() {
        assert.equal(resolve.sync('http', {}), 'http');
    });
});
