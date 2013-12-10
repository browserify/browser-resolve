var assert = require('assert');
var resolve = require('../');

var fixtures_dir = __dirname + '/fixtures-coffee/node_modules';

// no package.json, load index.js
describe('index.js of module dir', function() {
    var parent = {
        paths: [ fixtures_dir ],
        extensions: ['.js', '.coffee']
    };

    test('async', function(done) {
        resolve('module-a', parent, function(err, path) {
            assert.ifError(err);
            assert.equal(path,
                require.resolve('./fixtures-coffee/node_modules/module-a/index.coffee'));
            done();
        });
    });

    test('sync', function() {
        assert.equal(resolve.sync('module-a', parent),
            require.resolve('./fixtures-coffee/node_modules/module-a/index.coffee'));
    });
});

// package.json main field specifies other location
describe('alternate main', function() {
    var parent = {
        paths: [ fixtures_dir ],
        extensions: ['.js', '.coffee']
    };

    test('async', function(done) {
        resolve('module-b', parent, function(err, path) {
            assert.ifError(err);
            assert.equal(path,
                require.resolve('./fixtures-coffee/node_modules/module-b/main.coffee'));
            done();
        });
    });

    test('sync', function() {
        assert.equal(resolve.sync('module-b', parent),
            require.resolve('./fixtures-coffee/node_modules/module-b/main.coffee'));
    });
});

// package.json has 'browser' field which is a string
describe('string browser field as main', function() {
    var parent = {
        paths: [ fixtures_dir ],
        extensions: ['.js', '.coffee']
    };

    test('async', function(done) {
        resolve('module-c', parent, function(err, path) {
            assert.ifError(err);
            assert.equal(path,
                require.resolve('./fixtures-coffee/node_modules/module-c/browser.coffee'));
            done();
        });
    });

    test('sync', function() {
        assert.equal(resolve.sync('module-c', parent),
            require.resolve('./fixtures-coffee/node_modules/module-c/browser.coffee'));
    });
});

// package.json has 'browser' field which is a string
describe('string browser field as main - require subfile', function() {
    var parent = {
        filename: fixtures_dir + '/module-c/browser.js',
        paths: [ fixtures_dir + '/module-c/node_modules' ],
        extensions: ['.js', '.coffee']
    };

    test('async', function(done) {
        resolve('./bar', parent, function(err, path) {
            assert.ifError(err);
            assert.equal(path,
                require.resolve('./fixtures-coffee/node_modules/module-c/bar.coffee'));
            done();
        });
    });

    test('sync', function() {
        assert.equal(resolve.sync('./bar', parent),
            require.resolve('./fixtures-coffee/node_modules/module-c/bar.coffee'));
    });
});

// package.json has browser field as object
// one of the keys replaces the main file
// this would be done if the user needed to replace main and some other module
describe('object browser field as main', function() {
    var parent = {
        paths: [ fixtures_dir ],
        extensions: ['.js', '.coffee']
    };

    test('async', function(done) {
        resolve('module-d', parent, function(err, path) {
            assert.ifError(err);
            assert.equal(path,
                require.resolve('./fixtures-coffee/node_modules/module-d/browser.coffee'));
            done();
        });
    });

    test('sync', function() {
        assert.equal(resolve.sync('module-d', parent),
            require.resolve('./fixtures-coffee/node_modules/module-d/browser.coffee'));
    });
});

// browser field in package.json maps ./foo.js -> ./browser.js
// when we resolve ./foo while in module-e, this mapping should take effect
// the result is that ./foo resolves to ./browser
describe('object browser field replace file', function() {
    var parent = {
        filename: fixtures_dir + '/module-e/main.coffee',
        extensions: ['.js', '.coffee']
    };

    test('async', function(done) {
        resolve('./foo', parent, function(err, path) {
            assert.ifError(err);
            assert.equal(path,
                require.resolve('./fixtures-coffee/node_modules/module-e/browser.coffee'));
            done();
        });
    });

    test('sync', function() {
        assert.equal(resolve.sync('./foo', parent),
            require.resolve('./fixtures-coffee/node_modules/module-e/browser.coffee'));
    });
});

// same as above, but without a paths field in parent
// should still checks paths on the filename of parent
describe('object browser field replace file - no paths', function() {
    var parent = {
        filename: fixtures_dir + '/module-f/lib/main.coffee',
        extensions: ['.js', '.coffee']
    };

    test('async', function(done) {
        resolve('./foo', parent, function(err, path) {
            assert.ifError(err);
            assert.equal(path,
                require.resolve('./fixtures-coffee/node_modules/module-f/lib/browser.coffee'));
            done();
        });
    });

    test('sync', function() {
        assert.equal(resolve.sync('./foo', parent),
            require.resolve('./fixtures-coffee/node_modules/module-f/lib/browser.coffee'));
    });
});

describe('replace module in browser field object', function() {
    var parent = {
        filename: fixtures_dir + '/module-g/index.js',
        extensions: ['.js', '.coffee']
    };

    test('async', function(done) {
        resolve('foobar', parent, function(err, path) {
            assert.ifError(err);
            assert.equal(path,
                require.resolve('./fixtures-coffee/node_modules/module-g/foobar-browser.coffee'));
            done();
        });
    });

    test('sync', function() {
        assert.equal(resolve.sync('foobar', parent),
            require.resolve('./fixtures-coffee/node_modules/module-g/foobar-browser.coffee'));
    });
});
