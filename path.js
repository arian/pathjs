"use strict";

var Routes = require('./lib/routes');
var History = require('./lib/history');

var routes = new Routes();
// historie, instead of history for jshint, and not overwrite browser globals
var historie = new History();

var Path = {

    routes: routes,
    history: historie,

    map: function(path) {
        return routes.map(path);
    },
	
	match: function(path) {
        return routes.match(path);
    },
	
    open: function(path) {
        historie.open(path);
        return this;
    },

    rescue: function(fn) {
        routes.rescue(fn);
        return this;
    },

    listen: function() {
        historie.listen(function(path) {
            routes.dispatch(path);
        });
        return this;
    }

};

module.exports = Path;
