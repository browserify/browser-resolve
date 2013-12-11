var path = require('path');

// given a path, create an array of node_module paths for it
// borrowed from substack/resolve
function nodeModulesPaths (start, opts) {
    var splitRe = process.platform === 'win32' ? /[\/\\]/ : /\/+/;
    var parts = start.split(splitRe);

    var dirs = [];
    for (var i = parts.length - 1; i >= 0; i--) {
        if (parts[i] === 'node_modules') continue;
        var dir = path.join(
            path.join.apply(path, parts.slice(0, i + 1)),
            'node_modules'
        );
        if (!parts[0].match(/([A-Za-z]:)/)) {
            dir = '/' + dir;
        }
        dirs.push(dir);
    }

    if (opts.paths) {
        dirs.push.apply(dirs, opts.paths);
    }

    dirs = dirs.map(function(p) {
        return path.dirname(p);
    });

    return dirs;
}

function normalizeShims(info, shims, cur_path) {
    // http://nodejs.org/api/modules.html#modules_loading_from_node_modules_folders
    Object.keys(info.browser).forEach(function(key) {
        if (info.browser[key] === false) {
            return shims[key] = path.join(path.dirname(__dirname), '/empty.js');
        }

        var val = info.browser[key];

        // if target is a relative path, then resolve
        // otherwise we assume target is a module
        if (val[0] === '.') {
            val = path.resolve(cur_path, val);
        }

        // if does not begin with / ../ or ./ then it is a module
        if (key[0] !== '/' && key[0] !== '.') {
            return shims[key] = val;
        }

        var key = path.resolve(cur_path, key);
        shims[key] = val;
    });
}

function packageFilter(opts) {
    return function(info) {
        if (opts.packageFilter) info = opts.packageFilter(info);

        // support legacy browserify field
        if (typeof info.browserify === 'string' && !info.browser) {
            info.browser = info.browserify;
        }

        // no browser field, keep info unchanged
        if (!info.browser) {
            return info;
        }

        // replace main
        if (typeof info.browser === 'string') {
            info.main = info.browser;
            return info;
        }

        var replace_main = info.browser[info.main || './index.js'];
        info.main = replace_main || info.main;
        return info;
    }
}

exports.normalizeShims = normalizeShims;
exports.nodeModulesPaths = nodeModulesPaths;
exports.packageFilter = packageFilter;
