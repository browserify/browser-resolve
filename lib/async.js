// builtin
var fs = require('fs');
var path = require('path');

// vendor
var resv = require('resolve');

var normalizeShims = require('./helpers').normalizeShims;
var nodeModulesPaths = require('./helpers').nodeModulesPaths;
var packageFilter = require('./helpers').packageFilter;


// paths is mutated
// load shims from first package.json file found
function load_shims(paths, cb) {
    // identify if our file should be replaced per the browser field
    // original filename|id -> replacement
    var shims = {};

    (function next() {
        var cur_path = paths.shift();
        if (!cur_path) {
            return cb(null, shims);
        }

        var pkg_path = path.join(cur_path, 'package.json');

        fs.readFile(pkg_path, 'utf8', function(err, data) {
            if (err) {
                // ignore paths we can't open
                // avoids an exists check
                if (err.code === 'ENOENT') {
                    return next();
                }

                return cb(err);
            }

            try {
                var info = JSON.parse(data);
            }
            catch (err) {
                err.message = pkg_path + ' : ' + err.message
                return cb(err);
            }

            // support legacy browserify field for easier migration from legacy
            // many packages used this field historically
            if (typeof info.browserify === 'string' && !info.browser) {
                info.browser = info.browserify;
            }

            // no replacements, skip shims
            if (!info.browser) {
                return cb(null, shims);
            }

            // if browser field is a string
            // then it just replaces the main entry point
            if (typeof info.browser === 'string') {
                var key = path.resolve(cur_path, info.main || 'index.js');
                shims[key] = path.resolve(cur_path, info.browser);
                return cb(null, shims);
            }

            normalizeShims(info, shims, cur_path);

            return cb(null, shims);
        });
    })();
};

function resolve(id, opts, cb) {

    // opts.filename
    // opts.paths
    // opts.modules
    // opts.packageFilter

    opts = opts || {};

    var base = path.dirname(opts.filename);
    var paths = nodeModulesPaths(base, opts);

    // we must always load shims because the browser field could shim out a module
    load_shims(paths, function(err, shims) {
        if (err) {
            return cb(err);
        }

        if (shims[id]) {
            // if the shim was is an absolute path, it was fully resolved
            if (shims[id][0] === '/') {
                return cb(null, shims[id], opts.package);
            }

            // module -> alt-module shims
            id = shims[id];
        }

        var modules = opts.modules || {};
        var shim_path = modules[id];
        if (shim_path) {
            return cb(null, shim_path);
        }

        // our browser field resolver
        // if browser field is an object tho?
        var full = resv(id, {
            paths: opts.paths,
            extensions: opts.extensions,
            basedir: base,
            package: opts.package,
            packageFilter: packageFilter(opts)
        }, function(err, full, pkg) {
            if (err) {
                return cb(err);
            }

            var resolved = (shims) ? shims[full] || full : full;
            cb(null, resolved, pkg);
        });
    });
};

module.exports = resolve;

