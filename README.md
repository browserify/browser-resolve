# browser-resolve [![Build Status](https://travis-ci.org/shtylman/node-browser-resolve.png?branch=master)](https://travis-ci.org/shtylman/node-browser-resolve)

node.js resolve algorithm with [browser](https://gist.github.com/shtylman/4339901) field support.

## example

```javascript
resolve(id, parent, function(err, path) {
});
```

## methods

```javascript
var resolve = require('browser-resolve');
```

### <code>resolve(pkg, parent, opts={}, callback)</code>

Resolve the module path string <code>pkg</code> relative to
<code>parent</code> into <code>callback(err, path)<code>.

Options are:

* <code>extensions</code> - array of file extensions to search.

Default option values are:

```
{
  extensions: ['.js']
}
```

## license

MIT
