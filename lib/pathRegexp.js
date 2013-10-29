"use strict";

var toString = Object.prototype.toString;

// Taken from express.js
// https://github.com/visionmedia/express/blob/9bed2b80eecb9/lib/utils.js#L294-L314
function pathRegexp(path, keys, sensitive, strict) {
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
}

module.exports = pathRegexp;
