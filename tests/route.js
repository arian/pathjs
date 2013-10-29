"use strict";

var expect = require('expect.js');
var Route = require('../lib/route');
var createSpy = require('./createSpy');

describe('Route', function() {

    it('should create a new route', function() {
        var route = new Route('/bar');
        expect(route instanceof Route).to.be.ok();
    });

    describe('match', function() {

        it('should match a route', function() {
            var route = new Route('/bar');
            var match = route.match('/bar');
            expect(match).to.be.ok();
            expect(match).to.eql({});
        });

        it('should not match a non-matching path', function() {
            var route = new Route('/bar');
            expect(route.match('/foo')).not.to.be.ok();
        });

        it('should match parameters in a path', function() {
            var route = new Route('/bar/:id/:type');
            expect(route.match('/bar/foo/image')).to.eql({
                id: 'foo',
                type: 'image'
            });
        });

        it('should match optional parameters in a path', function() {
            var route = new Route('/bar/:id/:type?');
            expect(route.match('/bar/foo')).to.eql({
                id: 'foo',
                type: undefined
            });
        });

        it('should match optional extra parts in a path', function() {
            var route = new Route('/bar/:id*');
            expect(route.match('/bar/foo/yeah')).to.eql({
                id: 'foo'
            });
        });

        it('should not match extra parts in a path', function() {
            var route = new Route('/bar/:id');
            expect(route.match('/bar/foo/yeah')).not.to.be.ok();
        });

    });

    describe('to', function() {

        it('should call the functions added by .to()', function() {
            var route = new Route('/bar/:id');
            var spy = createSpy();
            route.to(spy);
            route.doEnter({id: 1}, 1);
            expect(spy.callCount).to.be(1);
            expect(spy.args).to.eql([[{id: 1}, 1]]);
        });

        it('should add multiple functions from an array', function() {
            var route = new Route('/bar/:id');
            var spy = createSpy();
            route.to([spy, spy, spy]);
            route.doEnter();
            expect(spy.callCount).to.be(3);
        });

    });

    describe('exit', function() {

        it('should call the functions added by .exit()', function() {
            var route = new Route('/bar/:id');
            var spy = createSpy();
            route.exit(spy);
            route.doExit({id: 1}, 1);
            expect(spy.callCount).to.be(1);
            expect(spy.args).to.eql([[{id: 1}, 1]]);
        });

        it('should add multiple functions from an array', function() {
            var route = new Route('/bar/:id');
            var spy = createSpy();
            route.exit([spy, spy, spy]);
            route.doExit();
            expect(spy.callCount).to.be(3);
        });

    });

});
