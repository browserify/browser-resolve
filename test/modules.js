var assert = require('assert');
var resolve = require('../');

var fixtures_dir = __dirname + '/fixtures/node_modules';

// no package.json, load index.js
describe('index.js of module dir', function() {
    var opts = { paths: [ fixtures_dir ], package: { main: 'fixtures' } };

    test('async', function(done) {
        resolve('module-a', opts, function(err, path, pkg) {
            assert.ifError(err);
            assert.equal(path,
                require.resolve('./fixtures/node_modules/module-a/index'));
            assert.strictEqual(pkg, undefined);
            done();
        });
    });

    test('sync', function() {
        assert.equal(resolve.sync('module-a', opts),
            require.resolve('./fixtures/node_modules/module-a/index'));
    });
});

// package.json main field specifies other location
describe('alternate main', function() {
    var opts = { paths: [ fixtures_dir ], package: { main: 'fixtures' } };

    test('async', function(done) {
        resolve('module-b', opts, function(err, path, pkg) {
            assert.ifError(err);
            assert.equal(path,
                require.resolve('./fixtures/node_modules/module-b/main'));
            assert.strictEqual(pkg.main, './main.js');
            done();
        });
    });

    test('sync', function() {
        assert.equal(resolve.sync('module-b', opts),
            require.resolve('./fixtures/node_modules/module-b/main'));
    });
});


// package.json has 'browser' field which is a string
describe('string browser field as main', function() {
    var opts = { paths: [ fixtures_dir ], package: { main: 'fixtures' } };

    test('async', function(done) {
        resolve('module-c', opts, function(err, path, pkg) {
            assert.ifError(err);
            assert.equal(path,
                require.resolve('./fixtures/node_modules/module-c/browser'));
            assert.equal(pkg.main, './browser.js');
            done();
        });
    });

    test('sync', function() {
        assert.equal(resolve.sync('module-c', opts),
            require.resolve('./fixtures/node_modules/module-c/browser'));
    });
});

// package.json has 'browser' field which is a string
describe('string browser field as main - require subfile', function() {
    var parent = {
        filename: fixtures_dir + '/module-c/browser.js',
        paths: [ fixtures_dir + '/module-c/node_modules' ],
        package: { main: './browser.js' }
    };

    test('async', function(done) {
        resolve('./bar', parent, function(err, path, pkg) {
            assert.ifError(err);
            assert.equal(path,
                require.resolve('./fixtures/node_modules/module-c/bar'));
            assert.equal(pkg.main, './browser.js');
            done();
        });
    });

    test('sync', function() {
        assert.equal(resolve.sync('./bar', parent),
            require.resolve('./fixtures/node_modules/module-c/bar'));
    });
});


// package.json has browser field as object
// one of the keys replaces the main file
// this would be done if the user needed to replace main and some other module
describe('object browser field as main', function() {
    var opts = { paths: [ fixtures_dir ], package: { main: 'fixtures' } };

    test('async', function(done) {
        resolve('module-d', opts, function(err, path, pkg) {
            assert.ifError(err);
            assert.equal(path, require.resolve('./fixtures/node_modules/module-d/browser'));
            assert.equal(pkg.main, './browser.js');
            done();
        });
    });

    test('sync', function() {
        assert.equal(resolve.sync('module-d', opts),
            require.resolve('./fixtures/node_modules/module-d/browser'));
    });
});

// browser field in package.json maps ./foo.js -> ./browser.js
// when we resolve ./foo while in module-e, this mapping should take effect
// the result is that ./foo resolves to ./browser
describe('object browser field replace file', function() {
    var parent = {
        filename: fixtures_dir + '/module-e/main.js',
        package: { main: './main.js' }
    };

    test('async', function(done) {
        resolve('./foo', parent, function(err, path, pkg) {
            assert.ifError(err);
            assert.equal(path, require.resolve('./fixtures/node_modules/module-e/browser'));
            assert.equal(pkg.main, './main.js');
            done();
        });
    });

    test('sync', function() {
        assert.equal(resolve.sync('./foo', parent),
            require.resolve('./fixtures/node_modules/module-e/browser'));
    });
});

// browser field in package.json maps "module" -> "alternate module"
describe('test foobar -> module-b replacement', function() {
    var parent = {
        filename: fixtures_dir + '/module-h/index.js',
        package: { main: './index.js' }
    };

    test('async', function(done) {
        resolve('foobar', parent, function(err, path, pkg) {
            assert.ifError(err);
            assert.equal(path, require.resolve('./fixtures/node_modules/module-b/main'));
            assert.equal(pkg.main, './main.js');
            done();
        });
    });

    test('sync', function() {
        assert.equal(resolve.sync('foobar', parent),
            require.resolve('./fixtures/node_modules/module-b/main'));
    });
});

// same as above but replacing core
describe('test core -> module-c replacement', function() {
    var parent = {
        filename: fixtures_dir + '/module-h/index.js',
        package: { main: './index.js' }
    };

    test('async', function(done) {
        resolve('querystring', parent, function(err, path, pkg) {
            assert.ifError(err);
            assert.equal(path,
                require.resolve('./fixtures/node_modules/module-c/browser'));
            assert.equal(pkg.main, './browser.js');
            done();
        });
    });

    test('sync', function() {
        assert.equal(resolve.sync('querystring', parent),
            require.resolve('./fixtures/node_modules/module-c/browser'));
    });
});

// browser field in package.json maps "module" -> "alternate module"
describe('test foobar -> module-b replacement with transform', function() {
    var parent = {
        filename: fixtures_dir + '/module-i/index.js',
        package: { main: './index.js' }
    };

    test('async', function(done) {
        resolve('foobar', parent, function(err, path, pkg) {
            assert.ifError(err);
            assert.equal(path,
                require.resolve('./fixtures/node_modules/module-b/main'));
            assert.equal(pkg.main, './main.js');
            done();
        });
    });

    test('sync', function() {
        assert.equal(resolve.sync('foobar', parent),
            require.resolve('./fixtures/node_modules/module-b/main'));
    });
});

describe('test foobar -> module-i replacement with transform in replacement', function() {
    var parent = {
        filename: fixtures_dir + '/module-j/index.js',
        package: { main: './index.js' }
    };

    test('async', function(done) {
        resolve('foobar', parent, function(err, path, pkg) {
            assert.ifError(err);
            assert.equal(path,
                require.resolve('./fixtures/node_modules/module-i/index'));
            assert.equal(pkg.main, './index.js');
            assert.equal(pkg.browser['foobar'], 'module-b');
            assert.equal(pkg.browserify.transform, 'deamdify');
            done();
        });
    });

    test('sync', function() {
        assert.equal(resolve.sync('foobar', parent),
            require.resolve('./fixtures/node_modules/module-i/index'));
    });
});

// same as above, but without a paths field in parent
// should still checks paths on the filename of parent
describe('object browser field replace file - no paths', function() {
    var parent = {
        filename: fixtures_dir + '/module-f/lib/main.js',
        package: { main: './lib/main.js' }
    };

    test('async', function(done) {
        resolve('./foo', parent, function(err, path, pkg) {
            assert.ifError(err);
            assert.equal(path,
                require.resolve('./fixtures/node_modules/module-f/lib/browser'));
            assert.equal(pkg.main, './lib/main.js');
            done();
        });
    });

    test('sync', function() {
        assert.equal(resolve.sync('./foo', parent),
            require.resolve('./fixtures/node_modules/module-f/lib/browser'));
    });
});

describe('replace module in browser field object', function() {
    var parent = {
        filename: fixtures_dir + '/module-g/index.js',
        package: { main: './index.js' }
    };

    test('async', function(done) {
        resolve('foobar', parent, function(err, path, pkg) {
            assert.ifError(err);
            assert.equal(path,
                require.resolve('./fixtures/node_modules/module-g/foobar-browser'));
            assert.equal(pkg.main, './index.js');
            done();
        });
    });

    test('sync', function() {
        assert.equal(resolve.sync('foobar', parent),
            require.resolve('./fixtures/node_modules/module-g/foobar-browser'));
    });
});

describe('override engine shim', function() {
    var parent = {
        filename: fixtures_dir + '/override-engine-shim/index.js',
        package: { main: './index.js' },
        modules: { url: "wonderland" }
    };

    test('async', function(done) {
        resolve('url', parent, function(err, path, pkg) {
            assert.ifError(err);
            assert.equal(path,
                require.resolve('./fixtures/node_modules/override-engine-shim/url-browser'));
            done();
        });
    });

    test('sync', function() {
        assert.equal(resolve.sync('url', parent),
            require.resolve('./fixtures/node_modules/override-engine-shim/url-browser'));
    });
});

