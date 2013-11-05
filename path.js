"use strict";

var Router = require('./lib/router');
var History = require('./lib/history');

var router = new Router();
// historie, instead of history for jshint, and not overwrite browser globals
var historie = new History();

var Path = {

    router: router,
    history: historie,

    map: function(path) {
        return router.map(path);
    },

    match: function(path) {
        return router.match(path);
    },

    open: function(path) {
        historie.open(path);
        return this;
    },

    rescue: function(fn) {
        router.rescue(fn);
        return this;
    },

    listen: function() {
        historie.listen(function(path) {
            router.dispatch(path);
        });
        return this;
    }

};

module.exports = Path;
