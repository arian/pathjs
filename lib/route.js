"use strict";

var pathRegexp = require('./pathRegexp');

function Route(path) {
    this._path = path;
    this._keys = [];
    this._match = pathRegexp(path, this._keys);
    this._enter = [];
    this._exit = [];
}

function createToAndExit(method, property, call) {

    Route.prototype[method] = function(fn) {
        if (typeof fn == 'function') {
            this[property].push(fn);
        } else {
            this[property] = this[property].concat(fn);
        }
        return this;
    };

    Route.prototype[call] = function(params, other) {
        for (var i = 0, l = this[property].length; i < l; i++) {
            this[property][i].call(this, params, other);
        }
    };

}

createToAndExit('to', '_enter', 'doEnter');
createToAndExit('exit', '_exit', 'doExit');

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

module.exports = Route;
