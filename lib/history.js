"use strict";

function trimHash(path) {
    return (path.charAt(0) == '#') ? path.slice(1) : path;
}

function noop() {}

var addEvent = window.addEventListener ? function(name, fn) {
    window.addEventListener(name, fn);
} : window.attachEvent ? function(name, fn) {
    window.attachEvent('on' + name, fn);
} : noop;

var removeEvent = window.removeEventListener ? function(name, fn) {
    window.removeEventListener(name, fn);
} : window.detachEvent ? function(name, fn) {
    window.detachEvent('on' + name, fn);
} : noop;

function History() {
    this.hasPushState = !!history.pushState;
    this.current = null;
    this.callback = noop;
}

History.prototype.open = function(path) {
    if (this.hasPushState) {
        history.pushState(null, null, path);
        this.callback(path);
    } else {
        location.hash = (path.charAt(0) == '#' ? '' : '#') + path;
    }
};

History.prototype.replace = function(path) {
    if (this.hasPushState) {
        history.replaceState(null, null, path);
        // we can call the callback, just to be sure.
        // the callback checks if the current path is different from the new
        // path anyway
        this.callback(path);
    }
};

History.prototype._listenPushstate = function(callback) {

    var self = this;

    // if it's /bar/foo#/mix go to /mix
    var hash = location.hash.slice(1);
    if (hash) {
        this.replace(hash);
    }

    var fn = function(event){
        callback(location.pathname);
    };

    window.addEventListener('popstate', fn);

    callback(location.pathname);

    return function() {
        window.removeEventListener('popstate', fn);
    };

};

History.prototype._listenHash = function(callback) {

    var fn = function() {
        callback(trimHash(location.hash));
    };

    var timer;

    // The 'document.documentMode' checks below ensure that PathJS fires the right events
    // even in IE "Quirks Mode".
    if ('onhashchange' in window && (!document.documentMode || document.documentMode >= 8)) {
        addEvent('hashchange', fn);
    } else {
        timer = setInterval(fn, 50);
    }

    callback(trimHash(location.hash) || location.pathname);

    return function() {
        clearInterval(timer);
        removeEvent('hashchange', fn);
    };

};

History.prototype.listen = function(callback) {
    var self = this;
    var _callback = this.callback = function(path) {
        if (path != self.current) {
            self.current = path;
            callback(path);
        }
    };
    return this.hasPushState ?
        this._listenPushstate(_callback) :
        this._listenHash(_callback);
};

module.exports = History;
