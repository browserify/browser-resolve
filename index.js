// builtin
var fs = require('fs');
var path = require('path');

// vendor
var resv = require('resolve');

// core modules replaced by their browser capable counterparts
var core = {};

// load core modules from builtin dir
fs.readdirSync(__dirname + '/builtin/').forEach(function(file) {
    core[path.basename(file, '.js')] = path.join(__dirname, '/builtin/', file);
});

// manually add core which are provided by modules
core['http'] = require.resolve('http-browserify');
core['vm'] = require.resolve('vm-browserify');
core['crypto'] = require.resolve('crypto-browserify');
core['console'] = require.resolve('console-browserify');
core['zlib'] = require.resolve('zlib-browserify');
core['buffer'] = require.resolve('buffer-browserify');

function resolve(id, parent, cb) {

    if (resv.isCore(id)) {
        // return path to browser capable version if we have it
        return cb(null, core[id]);
    }

    // if id is relative
    // then load via relative path
    var base = path.dirname(parent.filename);

    var paths = [];
    if (parent && parent.paths) {
        paths = parent.paths.map(function(p) {
            return path.dirname(p);
        });
    }

    // TODO(shtylman) if id has no leading '.' then it will be
    // a module load and resolve will take care of it

    // identify if our file should be replaced per the browser field
    // original filename -> replacement
    var shims = {};
    for (var i=0 ; i<paths.length ; ++i) {
        var cur_path = paths[i];
        var pkg_path = path.join(cur_path, 'package.json');

        if (!fs.existsSync(pkg_path)) {
            continue;
        }

        var info = JSON.parse(fs.readFileSync(pkg_path, 'utf8'));

        // no replacements, skip making shims
        if (!info.browser) {
            break;
        }

        // if browser field is a string
        // then it just replaces the main entry point
        if (typeof info.browser === 'string') {
            var key = path.resolve(cur_path, info.main || 'index.js');
            shims[key] = path.resolve(cur_path, info.browser);
            break;
        }

        Object.keys(info.browser).forEach(function(key) {
            var val = path.resolve(cur_path, info.browser[key]);
            var key = path.resolve(cur_path, key);
            shims[key] = val;
        });
        break;
    }

    // our browser field resolver
    // if browser field is an object tho?
    var full = resv(id, {
        paths: parent.paths,
        basedir: base,
        packageFilter: function(info) {
            if (parent.packageFilter) info = parent.packageFilter(info);

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
    }, function(err, full) {
        var resolved = (shims) ? shims[full] || full : full;
        cb(null, resolved);
    });
};

module.exports = resolve;

