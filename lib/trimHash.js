module.exports = function(path) {
    return (path.charAt(0) == '#') ? path.slice(1) : path;
};
