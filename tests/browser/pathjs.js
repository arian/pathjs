"use strict";

var pathjs = require('../../../pathjs');
var expect = require('expect.js');

var scale = 1000;
var delay = 0;

var root = '/tests/browser/pathjs.html';

var statusElement = document.getElementById('status');
statusElement.innerHTML += 'running<br>';

var paths = [];

pathjs.map('/foo/:id').to(function(params, previous) {
    statusElement.innerHTML += 'enter - ' + this._path + ' = ' + params.id + (previous ? ' from ' + previous._path : '') + '<br>';
    paths.push({enter: true, path: this._path, params: params});
}).exit(function(params, next) {
    statusElement.innerHTML += 'exit - /foo/' + (next ? ' for ' + next._path : '') + '<br>';
    paths.push({exit: true, path: this._path, params: params});
});

pathjs.map('/bar/:id').to(function(params) {
    statusElement.innerHTML += 'enter - ' + this._path + ' = ' + params.id + '<br>';
    paths.push({enter: true, path: this._path, params: params});
});

pathjs.map(root).to(function() {
    statusElement.innerHTML += 'enter - ' + this._path + '<br>';
    paths.push({enter: true, path: this._path});
});

pathjs.rescue(function(path) {
    statusElement.innerHTML += 'could not route ' + path + '<br>';
    paths.push({rescue: true, path: path});
});

pathjs.listen();

setTimeout(function() {
    pathjs.open('/foo/31');
}, ++delay * scale);

setTimeout(function() {
    pathjs.open('/bar/66');
}, ++delay * scale);

setTimeout(function() {
    history.back();
}, ++delay * scale);

setTimeout(function() {
    pathjs.open('/wtos');
}, ++delay * scale);

setTimeout(function() {
    pathjs.open(root);
}, ++delay * scale);

setTimeout(function() {
    expect(paths).to.eql([
        {enter: true, path: root},
        {enter: true, path: '/foo/:id', params: {id: '31'}},
        {exit: true, path: '/foo/:id', params: {id: '31'}},
        {enter: true, path: '/bar/:id', params: {id: '66'}},
        {enter: true, path: '/foo/:id', params: {id: '31'}},
        {exit: true, path: '/foo/:id', params: {id: '31'}},
        {rescue: true, path: '/wtos'},
        {enter: true, path: '/tests/browser/pathjs.html'}
    ]);
    statusElement.innerHTML += 'done<br>';
    document.body.style.background = 'green';
}, ++delay * scale);

window.onerror = function() {
    document.body.style.background = 'red';
    statusElement.innerHTML += 'ERROR<br>';
};
