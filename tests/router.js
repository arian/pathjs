"use strict";

var expect = require('expect.js');
var Router = require('../lib/router');
var createSpy = require('./createSpy');

function addRoutes(router) {
    var spiesEnter = {
        bar: createSpy(),
        foo: createSpy()
    };
    var spiesExit = {
        bar: createSpy(),
        foo: createSpy()
    };
    var routes = {
        bar: router.map('/bar/:id').to(spiesEnter.bar).exit(spiesExit.bar),
        foo: router.map('/foo/:id').to(spiesEnter.foo).exit(spiesExit.foo)
    };
    return {enter: spiesEnter, exit: spiesExit, routes: routes};
}

describe('Router', function() {

    it('should create a new router instance', function() {
        var router = new Router();
        expect(router instanceof Router).to.be.ok();
    });

    it('should add mappings to the router and dispatch', function() {
        var router = new Router();
        var spy = createSpy();
        router.map('/bar').to(spy);
        router.dispatch('/bar');
        expect(spy.callCount).to.be(1);
    });

    it('should dispatch the foo router for /foo', function() {
        var router = new Router();
        var spies = addRoutes(router);
        router.dispatch('/foo/31');
        expect(spies.enter.foo.callCount).to.be(1);
    });

    it('should go from /bar to /foo and call the exit function', function() {
        var router = new Router();
        var spies = addRoutes(router);
        router.dispatch('/bar/31');
        expect(spies.enter.bar.callCount).to.be(1);
        router.dispatch('/foo/31');
        expect(spies.exit.bar.callCount).to.be(1);
        expect(spies.enter.foo.callCount).to.be(1);
    });

    it('should not dispatch for the current path', function() {
        var router = new Router();
        var spies = addRoutes(router);
        router.dispatch('/bar/31');
        router.dispatch('/bar/31');
        expect(spies.enter.bar.callCount).to.be(1);
    });

    it('should call the exit spy with the new route', function() {
        var router = new Router();
        var spies = addRoutes(router);
        router.dispatch('/bar/31');
        expect(spies.enter.bar.callCount).to.be(1);
        router.dispatch('/foo/31');
        expect(spies.exit.bar.callCount).to.be(1);
        expect(spies.exit.bar.args[0][1] == spies.routes.foo).to.be.ok();
        expect(spies.enter.foo.args[0][1] == spies.routes.bar).to.be.ok();
    });

    it('should call the enter spy with the params and previous route', function() {
        var router = new Router();
        var spies = addRoutes(router);
        router.dispatch('/bar/31');
        expect(spies.enter.bar.callCount).to.be(1);
        router.dispatch('/foo/31');
        expect(spies.enter.bar.callCount).to.be(1);
        expect(spies.enter.foo.args[0][0]).to.eql({id: 31});
        expect(spies.enter.foo.args[0][1] == spies.routes.bar).to.be.ok();
    });

    it('should not matter if the router is dispatched with a hash like #/bar/31', function() {
        var router = new Router();
        var spies = addRoutes(router);
        router.dispatch('#/bar/31');
        expect(spies.enter.bar.callCount).to.be(1);
    });

    it('should not matter if the routers are matched with a hash like #/bar/31', function() {
        var router = new Router();
        var spies = addRoutes(router);
        expect(router.match('#/bar/31')).to.be.ok();
    });

    it('should call rescue functions if no route is found', function() {
        var router = new Router();
        var spy1 = createSpy(), spy2 = createSpy();
        router.rescue(spy1).rescue(spy2);
        router.dispatch('/yo');
        expect(spy1.callCount).to.be(1);
        expect(spy2.callCount).to.be(1);
        expect(spy1.args[0][0]).to.equal('/yo');
        expect(spy2.args[0][0]).to.equal('/yo');
    });

});
