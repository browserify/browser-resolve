// builtin
var fs = require('fs');
var path = require('path');

// vendor
var resv = require('resolve');

function resolve(id, parent, cb) {

    // TODO(shylman) shim core modules
    if (resv.isCore(id)) {
        return cb();
    }

    // if id is relative
    // then load via relative path
    var base = path.dirname(parent.filename);

    var paths = parent.paths.map(function(p) {
        return path.dirname(p);
    });

    // TODO(shtylman) if id has no leading '.' then it will be
    // a module load and resolve will take care of it

    // identify if our file should be replaced per the browser field
    var shims;
    for (var i=0 ; i<paths.length ; ++i) {
        var pkg_path = path.join(paths[i], 'package.json');

        if (!fs.existsSync(pkg_path)) {
            continue;
        }

        var info = JSON.parse(fs.readFileSync(pkg_path, 'utf8'));

        if (!info.browser) {
            break;
        }

        var shims = {};
        Object.keys(info.browser).forEach(function(key) {
            val = path.resolve(paths[i], info.browser[key]);
            key = path.resolve(paths[i], key);
            shims[key] = val;
        });
        break;
    }

    // our browser field resolver
    // if browser field is an object tho?
    var full = resv.sync(id, {
        paths: parent.paths,
        basedir: base,
        packageFilter: function(info) {
            // if info.browser is an object?
            info.main = info.browser;
            return info;
        }
    });

    var resolved = (shims) ? shims[full] || full : full;
    cb(null, resolved);
};

