"use strict";

function trimHash(path) {
    return (path.charAt(0) == '#') ? path.slice(1) : path;
}

function History() {
    this.hasPushState = !!history.pushState;
}

History.prototype.open = function(path) {
    if (this.hasPushState) {
        history.pushState({}, path, path);
    } else {
        location.hash = (path.charAt(0) == '#' ? '' : '#') + path;
    }
};

History.prototype._listenPushstate = function(callback) {

    var self = this;

    // if it's /bar/foo#/mix go to /mix
    var hash = location.hash.slice(1);
    if (hash) {
        this.open(hash);
    }

    var fn = function(event){
        callback(location.pathname);
    };

    window.addEventListener('popstate', fn, false);

    callback(location.pathname);

    return function() {
        window.removeEventListener('popstate', fn);
    };
};

History.prototype._listenHash = function(callback) {

    // from /mix to /mix#/mix
    if (location.hash) {
        location.href = trimHash(location.hash);
    }

    var fn = function() {
        callback(location.hash);
    };

    var timer;

    // The 'document.documentMode' checks below ensure that PathJS fires the right events
    // even in IE "Quirks Mode".
    if ("onhashchange" in window && (!document.documentMode || document.documentMode >= 8)) {
        window.attachEvent('onhashchange', fn);
    } else {
        timer = setInterval(fn, 50);
    }

    callback(location.hash);

    return function() {
        clearInterval(timer);
        window.detachEvent('onhashchange', fn);
    };
};

History.prototype.listen = function(callback) {
    return this.hasPushState ?
        this._listenPushstate(callback) :
        this.listenHash(callback);
};


module.exports = History;
