"use strict";

var Route = require('./route');
var trimHash = require('./trimHash');

function Router(){
    this.defined = {};
    this.current = null;
    this.previous = null;
    this.params = null;
    this.rescues = [];
}

Router.prototype.map = function(path) {
    return this.defined[path] || (this.defined[path] = new Route(path));
};

Router.prototype.rescue = function(fn) {
    this.rescues.push(fn);
    return this;
};

Router.prototype.match = function(path) {

    path = trimHash(path);

    var routes = this.defined;

    for (var route in routes) {
        route = routes[route];

        var match = route.match(path);
        if (match){
            return {route: route, match: match};
        }
    }

    return null;
};

Router.prototype.dispatch = function(path) {

    path = trimHash(path);

    if (this.current == path) return;

    var m = this.match(path);
    var newRoute = m ? m.route : null;

    // Exit previous route
    var previous = this.previous;
    if (previous) {
        previous.doExit(this.params, newRoute);
    }

    if (m) {

        // open new route, if exists
        var match = m.match;
        newRoute.doEnter(match, this.previous);
        this.params = match;

    } else {

        // rescue, no routes match
        for (var i = 0; i < this.rescues.length; i++) {
            this.rescues[i].call(this, path);
        }

    }

    this.current = path;
    this.previous = newRoute;

};

module.exports = Router;
