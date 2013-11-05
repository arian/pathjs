"use strict";

var History = require('../../lib/history');
var expect = require('expect.js');

var scale = 1000;
var delay = 0;

var root = '/tests/browser/history.html';

var statusElement = document.getElementById('status');
statusElement.innerHTML += 'running<br>';

function run(pushState) {

    var historie = new History();

    if (pushState && !historie.hasPushState) return 0;
    historie.hasPushState = !!pushState;

    var paths = [];
    var calls = 0;
    var i = 1;

    var detach = historie.listen(function(path) {
        statusElement.innerHTML += path + '<br>';
        paths.push(path);
    });

    var ignore = historie.listen(function() {
        calls++;
    });

    setTimeout(function() {
        expect(paths.shift()).to.be(root);
        historie.open('/bar');
    }, i++ * scale);

    setTimeout(function() {
        expect(paths.shift()).to.equal('/bar');
        historie.open('/foo');
    }, i++ * scale);

    setTimeout(function() {
        expect(paths.shift()).to.equal('/foo');
        history.back();
    }, i++ * scale);

    setTimeout(function() {
        expect(paths.shift()).to.equal('/bar');
        ignore();
        expect(calls).to.equal(3);
        historie.open(root);
    }, i++ * scale);

    setTimeout(function() {
        expect(paths.shift()).to.equal(root);
        expect(calls).to.equal(3);
        detach();
    }, i++ * scale);

    return i;

}

delay =+ run(true);

setTimeout(function() {
    delay = run();

    setTimeout(function() {
        document.body.style.background = 'green';
        statusElement.innerHTML += 'done<br>';
    }, delay * scale);

}, delay * scale);

window.onerror = function() {
    document.body.style.background = 'red';
    statusElement.innerHTML += 'ERROR<br>';
};
