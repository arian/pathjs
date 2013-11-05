"use strict";

var Router = require('./lib/router');
var History = require('./lib/history');

var router = new Router();
// historie, instead of history for jshint, and not overwrite browser globals
var historie = new History();

exports.router = router;

exports.history = historie;

exports.map = function(path) {
    return router.map(path);
};

exports.match = function(path) {
    return router.match(path);
};

exports.open = function(path) {
    historie.open(path);
    return this;
};

exports.rescue = function(fn) {
    router.rescue(fn);
    return this;
};

exports.listen = function() {
    historie.listen(function(path) {
        router.dispatch(path);
    });
    return this;
};
