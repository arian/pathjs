"use strict";

function createSpy() {
    var fn = function() {
        fn.callCount++;
        fn.args.push(Array.prototype.slice.call(arguments));
    };
    fn.callCount = 0;
    fn.args = [];
    return fn;
}

module.exports = createSpy;
