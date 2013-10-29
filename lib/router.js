"use strict";

var Route = require('./route');

function trimHash(path) {
    return (path.charAt(0) == '#') ? path.slice(1) : path;
}

function Router(){
    this.defined = {};
    this.current = null;
    this.previous = null;
    this.params = null;
}

Router.prototype.map = function (path) {
    return this.defined[path] || (this.defined[path] = new Route(path));
};

Router.prototype.match = function(path) {

    path = trimHash(path);

    var routes = this.defined;

    for (var route in routes) {
        if (route !== null && route !== undefined) {
            route = routes[route];

            var match = route.match(path);
            if (match){
                return {route: route, match: match};
            }
        }
    }

    return null;
};

Router.prototype.dispatch = function(path) {

    path = trimHash(path);

    if (this.current != path){

        var m = this.match(path);

        if (m) {

            var match = m.match;
            var route = m.route;

            var previous = this.previous;
            if (previous) {
                previous.doExit(this.params, route);
            }

            route.doEnter(match, this.previous);

            this.current = path;
            this.params = match;
            this.previous = route;

            return;
        }
    }
};

module.exports = Router;
