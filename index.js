exports = module.exports = require('./lib/async');
exports.core = require('resolve').core;
exports.isCore = require('resolve').isCore;
exports.sync = require('./lib/sync');
