var assert = require('assert');
var resolve = require('../');

var fixtures_dir = __dirname + '/fixtures/node_modules';

// no package.json, load index.js
test('index.js of module dir', function(done) {
    resolve('module-a', { paths: [ fixtures_dir ], package: { main: 'fixtures' } }, function(err, path, pkg) {
        assert.ifError(err);
        assert.equal(path, require.resolve('./fixtures/node_modules/module-a/index'));
        assert.strictEqual(pkg, undefined);
        done();
    });
});

// package.json main field specifies other location
test('alternate main', function(done) {
    resolve('module-b', { paths: [ fixtures_dir ], package: { main: 'fixtures' } }, function(err, path, pkg) {
        assert.ifError(err);
        assert.equal(path, require.resolve('./fixtures/node_modules/module-b/main'));
        assert.equal(pkg.main, './main.js');
        done();
    });
});

// package.json has 'browser' field which is a string
test('string browser field as main', function(done) {
    resolve('module-c', { paths: [ fixtures_dir ], package: { main: 'fixtures' } }, function(err, path, pkg) {
        assert.ifError(err);
        assert.equal(path, require.resolve('./fixtures/node_modules/module-c/browser'));
        assert.equal(pkg.main, './browser.js');
        done();
    });
});

// package.json has 'browser' field which is a string
test('string browser field as main - require subfile', function(done) {
    var parent = {
        filename: fixtures_dir + '/module-c/browser.js',
        paths: [ fixtures_dir + '/module-c/node_modules' ],
        package: { main: './browser.js' }
    };

    resolve('./bar', parent, function(err, path, pkg) {
        assert.ifError(err);
        assert.equal(path, require.resolve('./fixtures/node_modules/module-c/bar'));
        assert.equal(pkg.main, './browser.js');
        done();
    });
});

// package.json has browser field as object
// one of the keys replaces the main file
// this would be done if the user needed to replace main and some other module
test('object browser field as main', function(done) {
    resolve('module-d', { paths: [ fixtures_dir ], package: { main: 'fixtures' } }, function(err, path, pkg) {
        assert.ifError(err);
        assert.equal(path, require.resolve('./fixtures/node_modules/module-d/browser'));
        assert.equal(pkg.main, './browser.js');
        done();
    });
});

// browser field in package.json maps ./foo.js -> ./browser.js
// when we resolve ./foo while in module-e, this mapping should take effect
// the result is that ./foo resolves to ./browser
test('object browser field replace file', function(done) {
    var parent = {
        filename: fixtures_dir + '/module-e/main.js',
        package: { main: './main.js' }
    };

    resolve('./foo', parent, function(err, path, pkg) {
        assert.ifError(err);
        assert.equal(path, require.resolve('./fixtures/node_modules/module-e/browser'));
        assert.equal(pkg.main, './main.js');
        done();
    });
});

// same as above, but without a paths field in parent
// should still checks paths on the filename of parent
test('object browser field replace file - no paths', function(done) {
    var parent = {
        filename: fixtures_dir + '/module-f/lib/main.js',
        package: { main: './lib/main.js' }
    };

    resolve('./foo', parent, function(err, path, pkg) {
        assert.ifError(err);
        assert.equal(path, require.resolve('./fixtures/node_modules/module-f/lib/browser'));
        assert.equal(pkg.main, './lib/main.js');
        done();
    });
});

test('replace module in browser field object', function(done) {
    var parent = {
        filename: fixtures_dir + '/module-g/index.js',
        package: { main: './index.js' }
    };

    resolve('foobar', parent, function(err, path, pkg) {
        assert.ifError(err);
        assert.equal(path, require.resolve('./fixtures/node_modules/module-g/foobar-browser'));
        assert.equal(pkg.main, './index.js');
        done();
    });
});

test('replace module in object browser field with subdirectory', function(done) {
    var parent = {
        filename: fixtures_dir + '/module-h/index.js',
        package: { main: './index.js' }
    };

    resolve('foobar', parent, function(err, path, pkg) {
        assert.ifError(err);
        assert.equal(path, __dirname + '/fixtures/node_modules/module-h/foobar-browser/index.js');
        assert.equal(pkg.main, './index.js');
        done();
    });
});

test('replace module in object browser field with subdirectory containing package.json', function(done) {
    var parent = {
        filename: fixtures_dir + '/module-i/index.js',
        package: { main: './index.js' }
    };

    resolve('foobar', parent, function(err, path, pkg) {
        assert.ifError(err);
        assert.equal(path, __dirname + '/fixtures/node_modules/module-i/foobar-browser/main.js');
        assert.equal(pkg.main, './main.js');
        done();
    });
});

test('replace module in object browser field with subdirectory containing package.json with string browser field as main', function(done) {
    var parent = {
        filename: fixtures_dir + '/module-j/index.js',
        package: { main: './index.js' }
    };

    resolve('foobar', parent, function(err, path, pkg) {
        assert.ifError(err);
        assert.equal(path, __dirname + '/fixtures/node_modules/module-j/foobar-browser/browser.js');
        assert.equal(pkg.main, './browser.js');
        done();
    });
});

test('replace module in object browser field with subdirectory containing package.json with object browser field as main', function(done) {
    var parent = {
        filename: fixtures_dir + '/module-k/index.js',
        package: { main: './index.js' }
    };

    resolve('foobar', parent, function(err, path, pkg) {
        assert.ifError(err);
        assert.equal(path, __dirname + '/fixtures/node_modules/module-k/foobar-browser/browser.js');
        assert.equal(pkg.main, './browser.js');
        done();
    });
});
