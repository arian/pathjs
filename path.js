"use strict";

function trimHash(path) {
    if (path.charAt(0) == '#') {
        path = path.slice(1);
    }
    return path;
}

var Path = {

    version: "0.8.4",

//    hasPushState: !!window.history.pushState,
    hasPushState: false,

    map: function (path){
        var defined = Path.routes.defined;
        return defined[path] || (defined[path] = new Route(path));
    },

    root: function (path) {
        Path.routes.root = path;
        return this;
    },

    open: function(path) {
        if (Path.hasPushState) {
            history.pushState({}, path, path);
        } else {
            location.hash = (path.charAt(0) == '#' ? '' : '#') + path;
        }
    },

    popState: function(event){
        Path.dispatch(location.pathname);
    },

    listen: function(){

        if (Path.hasPushState){

            // if it's /bar/foo#/mix go to /mix
            var hash = location.hash.slice(1);
            if (hash) {
                Path.open(hash);
            }

            window.addEventListener('popstate', function(event){
                Path.popState(event);
            }, false);

            Path.dispatch(location.pathname);

        } else {

            // from /mix to /mix#/mix
            if (location.hash) {
                location.href = trimHash(location.hash);
            }

            var fn = function() {
                Path.dispatch(location.hash);
            };

            // The 'document.documentMode' checks below ensure that PathJS fires the right events
            // even in IE "Quirks Mode".
            if ("onhashchange" in window && (!document.documentMode || document.documentMode >= 8)) {
                window.onhashchange = fn;
            } else {
                setInterval(fn, 50);
            }

            Path.dispatch(location.hash);

        }
    },

    match: function(path) {
        path = trimHash(path);

        var routes = Path.routes.defined;

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
    },

    dispatch: function(path) {
        path = trimHash(path);

        var routes = Path.routes;

        if (routes.current != path){

            var m = Path.match(path);

            if (m) {

                var match = m.match;
                var route = m.route;

                var previous = routes.previous;
                if (previous) {
                    previous.doExit(routes.params, route);
                }

                route.doEnter(match, routes.previous);

                routes.current = path;
                routes.params = match;
                routes.previous = route;

                return;
            }
        }
    },

    routes: {
        params: {},
        current: null,
        previous: null,
        defined: {}
    }
};

var toString = Object.prototype.toString;

// Taken from express.js
// https://github.com/visionmedia/express/blob/9bed2b80eecb9/lib/utils.js#L294-L314
var pathRegexp = function(path, keys, sensitive, strict) {
    if (toString.call(path) == '[object RegExp]') return path;
    if (typeof path != 'string' && path && path.join) path = '(' + path.join('|') + ')';
    path = path
        .concat(strict ? '' : '/?')
        .replace(/\/\(/g, '(?:/')
        .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?(\*)?/g, function(_, slash, format, key, capture, optional, star){
            keys.push({
                name: key,
                optional: !!optional
            });
            slash = slash || '';
            return '' +
                (optional ? '' : slash) +
                '(?:' +
                (optional ? slash : '') +
                (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')' +
                (optional || '') +
                (star ? '(/*)?' : '');
        })
        .replace(/([\/.])/g, '\\$1')
        .replace(/\*/g, '(.*)');
    return new RegExp('^' + path + '$', sensitive ? '' : 'i');
};

function Route(path) {
    this._path = path;
    this._keys = [];
    this._match = pathRegexp(path, this._keys);
    this._enter = [];
    this._exit = [];
}

Route.prototype.to = function(fn) {
    if (typeof fn == 'function') {
        this._enter.push(fn);
    } else {
        this._enter = this.enter.concat(fn);
    }
    return this;
};

Route.prototype.exit = function(fn) {
    if (typeof fn == 'function') {
        this._exit.push(fn);
    } else {
        this._exit = this._exit.concat(fn);
    }
    return this;
};

Route.prototype.doEnter = function(params, previous) {
    for (var i = 0, l = this._enter.length; i < l; i++) {
        this._enter[i].call(this, params, previous);
    }
};

Route.prototype.doExit = function(params, next) {
    for (var i = 0, l = this._exit.length; i < l; i++) {
        this._exit[i].call(this, params, next);
    }
};

Route.prototype.match = function(path) {
    if (typeof path != 'string') return false;
    var match = path.match(this._match);
    if (!match) return false;
    var result = {};
    for (var i = 0; i < this._keys.length; i++) {
        result[this._keys[i].name] = match[i + 1];
    }
    return result;
};

if (typeof module != 'undefined') {
    module.exports = Path;
}
