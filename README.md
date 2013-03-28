# browser-resolve [![Build Status](https://travis-ci.org/shtylman/node-browser-resolve.png?branch=master)](https://travis-ci.org/shtylman/node-browser-resolve)

node.js resolve algorithm with [browser](https://gist.github.com/shtylman/4339901) field support.

## example

you can resolve files like `require.resolve()`:
``` js
var resolve = require('browser-resolve');
resolve('../', { filename: __filename }, function(err, path) {
    console.log(path);
});
```

```
$ node example/resolve.js
/home/substack/projects/node-browser-resolve/index.js
```

or if you `require()` core modules you'll get a version that works in browsers:

``` js
var resolve = require('browser-resolve');
resolve('fs', null, function(err, path) {
    console.log(path);
});
```

```
$ node example/builtin.js
/home/substack/projects/node-browser-resolve/builtin/fs.js
```

and you can use the
[browser field](https://gist.github.com/shtylman/4339901) to load
browser-specific versions of modules:

``` js
{
  "name": "custom",
  "version": "0.0.0",
  "browser": {
    "./main.js": "custom.js"
  }
}
```

``` js
var resolve = require('browser-resolve');
var parent = { filename: __dirname + '/custom/file.js' };
resolve('./main.js', parent, function(err, path) {
    console.log(path);
});
```

```
$ node example/custom.js
/home/substack/projects/node-browser-resolve/example/custom/custom.js
```

## license

MIT
