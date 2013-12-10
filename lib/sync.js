var fs = require('fs');
var path = require('path');
var resvSync = require('resolve').sync;

var normalizeShims = require('./helpers').normalizeShims;
var nodeModulesPaths = require('./helpers').nodeModulesPaths;
var packageFilter = require('./helpers').packageFilter;


function load_shims_sync(paths) {
    var cur_path;
    var shims = {};

    while (cur_path = paths.shift()) {
        var data;
        var pkg_path = path.join(cur_path, 'package.json');


        try {
            data = fs.readFileSync(pkg_path, 'utf8');
        } catch (err) {
            if (err.code === 'ENOENT')
                continue;
            throw err
        }

        try {
            var info = JSON.parse(data);
        }
        catch (err) {
            err.message = pkg_path + ' : ' + err.message
            throw err
        }

        if (typeof info.browserify === 'string' && !info.browser) {
            info.browser = info.browserify;
        }

        if (!info.browser) {
            break;
        }

        if (typeof info.browser === 'string') {
            var key = path.resolve(cur_path, info.main || 'index.js');
            shims[key] = path.resolve(cur_path, info.browser);
            break;
        }

        normalizeShims(info, shims, cur_path);
    }

    return shims;
}

function resolveSync(id, opts) {

    opts = opts || {};

    var base = path.dirname(opts.filename);
    var paths = nodeModulesPaths(base, opts);

    var shims = load_shims_sync(paths);

    if (shims[id]) {
        // if the shim was is an absolute path, it was fully resolved
        if (shims[id][0] === '/') {
            return shims[id];
        }

        // module -> alt-module shims
        id = shims[id];
    }

    var modules = opts.modules || {};
    var shim_path = modules[id];
    if (shim_path) {
        return shim_path;
    }

    // our browser field resolver
    // if browser field is an object tho?
    var full = resvSync(id, {
        paths: opts.paths,
        extensions: opts.extensions,
        basedir: base,
        package: opts.package,
        packageFilter: packageFilter(opts)
    });

    var resolved = (shims) ? shims[full] || full : full;
    return resolved;
}

module.exports = resolveSync;
