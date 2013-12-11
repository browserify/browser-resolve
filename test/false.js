var assert = require('assert');
var path = require('path');
var resolve = require('../');

var fixtures_dir = __dirname + '/fixtures';

describe('false file', function() {
    var opts = { filename: fixtures_dir + '/node_modules/false/index.js' };

    test('async', function(done) {
        resolve('./fake.js', opts, function(err, p) {
            assert.ifError(err);
            assert.equal(p, path.normalize(__dirname + '/../empty.js'));
            done();
        });
    });

    test('sync', function() {
        assert.equal(resolve.sync('./fake.js', opts),
            path.normalize(__dirname + '/../empty.js'));
    });
});

describe('false module', function() {
    var opts = { filename: fixtures_dir + '/node_modules/false/index.js' };

    test('async', function(done) {
        resolve('ignore-me', opts, function(err, p) {
            assert.ifError(err);
            assert.equal(p, path.normalize(__dirname + '/../empty.js'));
            done();
        });
    });

    test('sync: false module', function() {
        assert.equal(resolve.sync('ignore-me', opts),
            path.normalize(__dirname + '/../empty.js'));
    });
});
