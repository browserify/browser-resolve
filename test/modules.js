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
        assert.strictEqual(pkg.main, './main.js');
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

// package.json has an alternative 'browser' field which is a string
test('string alt browser field as main - require subfile', function(done) {
    var parent = {
        filename: fixtures_dir + '/module-c/chromeapp.js',
        paths: [ fixtures_dir + '/module-c/node_modules' ],
        package: { main: './chromeapp.js' },
        browser: 'chromeapp'
    };

    resolve('./foo', parent, function(err, path, pkg) {
        assert.ifError(err);
        assert.equal(path, require.resolve('./fixtures/node_modules/module-c/foo'));
        assert.equal(pkg.main, './chromeapp.js');
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

// package.json has browser field as object
// one of the keys replaces the main file
// however the main has no prefix and browser uses ./ prefix for the same file
test('object browser field as main', function(done) {
    resolve('module-k', { paths: [ fixtures_dir ], package: { main: 'fixtures' } }, function(err, path, pkg) {
        assert.ifError(err);
        assert.equal(path, require.resolve('./fixtures/node_modules/module-k/browser'));
        assert.equal(pkg.main, './browser.js');
        done();
    });
});

test('deep module reference mapping', function(done) {
    resolve('module-l/direct', { basedir: __dirname + '/fixtures', package: { main: 'fixtures' } }, function(err, path, pkg) {
        assert.ifError(err);
        assert.equal(path, require.resolve('./fixtures/node_modules/module-l/browser-direct'));
        assert.equal(pkg.main, './browser.js');
        done();
    });
});

// package.json has browser field as object
// test that file resolves even though the file extension is omitted
test('deep module reference mapping without file extension - .js', function(done) {
    resolve('module-n/foo', { basedir: __dirname + '/fixtures', package: { main: 'fixtures' } }, function(err, path, pkg) {
        assert.ifError(err);
        assert.equal(path, require.resolve('./fixtures/node_modules/module-n/browser-foo'));
        done();
    });
});
test('deep module reference mapping without file extension - .json', function(done) {
    resolve('module-n/bar', { basedir: __dirname + '/fixtures', package: { main: 'fixtures' } }, function(err, path, pkg) {
        assert.ifError(err);
        assert.equal(path, require.resolve('./fixtures/node_modules/module-n/browser-bar'));
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

// browser field in package.json maps "module" -> "alternate module"
test('test foobar -> module-b replacement', function(done) {
    var parent = {
        filename: fixtures_dir + '/module-h/index.js',
        package: { main: './index.js' }
    };

    resolve('foobar', parent, function(err, path, pkg) {
        assert.ifError(err);
        assert.equal(path, require.resolve('./fixtures/node_modules/module-b/main'));
        assert.equal(pkg.main, './main.js');
        done();
    });
});

// same as above but replacing core
test('test core -> module-c replacement', function(done) {
    var parent = {
        filename: fixtures_dir + '/module-h/index.js',
        package: { main: './index.js' }
    };

    resolve('querystring', parent, function(err, path, pkg) {
        assert.ifError(err);
        assert.equal(path, require.resolve('./fixtures/node_modules/module-c/browser'));
        assert.equal(pkg.main, './browser.js');
        done();
    });
});

// same as above but with alt browser
test('test core -> module-c replacement with alt browser', function(done) {
    var parent = {
        filename: fixtures_dir + '/module-h/index.js',
        package: { main: './index.js' },
        browser: 'chromeapp'
    };

    resolve('querystring', parent, function(err, path, pkg) {
        assert.ifError(err);
        assert.equal(path, require.resolve('./fixtures/node_modules/module-c/chromeapp'));
        assert.equal(pkg.main, './chromeapp.js');
        done();
    });
});

// browser field in package.json maps "module" -> "alternate module"
test('test foobar -> module-b replacement with transform', function(done) {
    var parent = {
        filename: fixtures_dir + '/module-i/index.js',
        package: { main: './index.js' }
    };

    resolve('foobar', parent, function(err, path, pkg) {
        assert.ifError(err);
        assert.equal(path, require.resolve('./fixtures/node_modules/module-b/main'));
        assert.equal(pkg.main, './main.js');
        done();
    });
});

// browser field in package.json maps "relative file" -> "relative file" with no extension
test('test ./x -> ./y replacement', function(done) {
    var parent = {
        filename: fixtures_dir + '/module-t/index.js',
        package: { main: './index.js' }
    };

    resolve('./x', parent, function(err, path, pkg) {
        assert.ifError(err);
        assert.equal(path, require.resolve('./fixtures/node_modules/module-t/y.js'));
        done();
    });
});

test('test foobar -> module-i replacement with transform in replacement', function(done) {
    var parent = {
        filename: fixtures_dir + '/module-j/index.js',
        package: { main: './index.js' }
    };

    resolve('foobar', parent, function(err, path, pkg) {
        assert.ifError(err);
        assert.equal(path, require.resolve('./fixtures/node_modules/module-i/index'));
        assert.equal(pkg.main, './index.js');
        assert.equal(pkg.browser['foobar'], 'module-b');
        assert.equal(pkg.browserify.transform, 'deamdify');
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

test('override engine shim', function(done) {
    var parent = {
        filename: fixtures_dir + '/override-engine-shim/index.js',
        package: { main: './index.js' },
        modules: { url: 'wonderland' }
    };
    resolve('url', parent, function(err, path, pkg) {
        assert.ifError(err);
        assert.equal(path, require.resolve('./fixtures/node_modules/override-engine-shim/url-browser'));
        done();
    });
});

test('alt-browser field', function(done) {
    var parent = {
        filename: fixtures_dir + '/alt-browser-field/index.js',
        package: { main: './index.js' },
        browser: 'chromeapp'
    };

    resolve('url', parent, function(err, path, pkg) {
        assert.ifError(err);
        assert.equal(path, require.resolve('./fixtures/node_modules/alt-browser-field/url-chromeapp'));
        assert.equal(pkg.main, './index.js');
        done();
    });
});

test('alt-browser deep module reference mapping', function(done) {
    resolve('alt-browser-field/direct', {
        basedir: __dirname + '/fixtures',
        package: { main: 'fixtures' },
        browser: 'chromeapp'
    }, function(err, path, pkg) {
        assert.ifError(err);
        assert.equal(path, require.resolve('./fixtures/node_modules/alt-browser-field/chromeapp-direct'));
        assert.equal(pkg.main, './chromeapp.js');
        done();
    });
});

test('alt-browser fallback to "browser" on deps of deps', function(done) {
    var parent = {
        filename: fixtures_dir + '/alt-browser-field/foo.js',
        package: { main: './index.js' },
        browser: 'chromeapp'
    };

    resolve('foobar', parent, function(err, path, pkg) {
        assert.ifError(err);
        assert.equal(path, require.resolve('./fixtures/node_modules/module-k/browser'));
        assert.equal(pkg.main, './browser.js');
        assert.equal(pkg.browser['./index.js'], './browser.js');
        done();
    });
});

test('not fail on accessing path name defined in Object.prototype', function (done) {
    resolve('toString', { paths: [ fixtures_dir ], package: { main: 'fixtures' } }, function(err, path, pkg) {
        assert.ifError(err);
        assert.equal(path, require.resolve('./fixtures/node_modules/toString/index'));
        assert.strictEqual(pkg, undefined);
        done();
    });
});

test('respect symlinks', function (done) {
    // some systems (e.g. rush, pnpm) use symlinks to create a recursive dependency graph
    // instead of relying on the hoisting aspect of the node module resolution algorithm (like npm and yarn do)
    // in these cases, we want to resolve to the real path of a module, so that the tree structure below
    // only ever tries to run the `x` module once (rather than once on each module that depends on it)
    //
    // - node_modules
    //   - a
    //     - node_modules
    //       - symlink to x
    //   - b
    //     - node_modules
    //       - symlink to x
    //
    resolve('linked', { paths: [ fixtures_dir + '/linker/node_modules' ], package: { main: 'fixtures' } }, function(err, path, pkg) {
        assert.ifError(err);
        assert.equal(path, require.resolve('./fixtures/linked/index'));
        assert.strictEqual(pkg, undefined);
        done();
    });
});