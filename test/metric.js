/*

metric.js - TelemetryEvents.metric() test

The MIT License (MIT)

Copyright (c) 2014 Tristan Slominski, Leora Pearson

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

*/

"use strict";

var events = require('events');
var TelemetryEvents = require('../index.js');

var tests = module.exports = {};

var VALID_CONFIG = {
    emitter: new events.EventEmitter(),
    event: 'my-telemetry',
    package: {
        name: "package-name",
        version: "package-version"
    }
};

function assertEqual(test, thingy, actualValueOfThingy, expectedValueOfThingy) {
    test.equal(actualValueOfThingy, expectedValueOfThingy, "expected value for " + thingy + " was '" + expectedValueOfThingy + "' but received '" + actualValueOfThingy + "'");
}

tests['returns metric event'] = function (test) {
    test.expect(9);
    var telemetry = new TelemetryEvents(VALID_CONFIG);
    var event = telemetry.metric('foo', 'bar', 'MB/s', {foo: 'bar', baz: {hi: 'there'}});
    assertEqual(test, 'event.type', event.type, 'metric');
    assertEqual(test, 'event.name', event.name, 'foo');
    assertEqual(test, 'event.value', event.value, 'bar');
    assertEqual(test, 'event.unit', event.unit, 'MB/s');
    test.ok(event.timestamp, "Missing event.timestamp");
    assertEqual(test, 'event.module', event.module, 'package-name');
    assertEqual(test, 'event.version', event.version, 'package-version');
    assertEqual(test, 'event.foo', event.foo, 'bar');
    test.deepEqual(event.baz, {hi: 'there'}, "expected value for event.baz was '" + JSON.stringify({hi: 'there'}) + "' but received '" + JSON.stringify(event.baz));
    test.done();
};

tests["emits 'telemetry' event if emitter is specified but event is not"] = function (test) {
    test.expect(9);
    var _emitter = new events.EventEmitter();
    var telemetry = new TelemetryEvents({
            emitter: _emitter,
            package: {
                name: "package-name",
                version: "package-version"
            }
        });
    _emitter.on('telemetry', function (event) {
        assertEqual(test, 'event.type', event.type, 'metric');
        assertEqual(test, 'event.name', event.name, 'foo');
        assertEqual(test, 'event.value', event.value, 'bar');
        assertEqual(test, 'event.unit', event.unit, 'MB/s');
        test.ok(event.timestamp, "Missing event.timestamp");
        assertEqual(test, 'event.module', event.module, 'package-name');
        assertEqual(test, 'event.version', event.version, 'package-version');
        assertEqual(test, 'event.foo', event.foo, 'bar');
        test.deepEqual(event.baz, {hi: 'there'}, "expected value for event.baz was '" + JSON.stringify({hi: 'there'}) + "' but received '" + JSON.stringify(event.baz));
        test.done();
    });
    telemetry.metric('foo', 'bar', 'MB/s', {foo: 'bar', baz: {hi: 'there'}});
};

tests["emits configured event if emitter and event are specified"] = function (test) {
    test.expect(9);
    var _emitter = new events.EventEmitter();
    var telemetry = new TelemetryEvents({
            emitter: _emitter,
            event: 'my-telemetry',
            package: {
                name: "package-name",
                version: "package-version"
            }
        });
    _emitter.on('my-telemetry', function (event) {
        assertEqual(test, 'event.type', event.type, 'metric');
        assertEqual(test, 'event.name', event.name, 'foo');
        assertEqual(test, 'event.value', event.value, 'bar');
        assertEqual(test, 'event.unit', event.unit, 'MB/s');
        test.ok(event.timestamp, "Missing event.timestamp");
        assertEqual(test, 'event.module', event.module, 'package-name');
        assertEqual(test, 'event.version', event.version, 'package-version');
        assertEqual(test, 'event.foo', event.foo, 'bar');
        test.deepEqual(event.baz, {hi: 'there'}, "expected value for event.baz was '" + JSON.stringify({hi: 'there'}) + "' but received '" + JSON.stringify(event.baz));
        test.done();
    });
    telemetry.metric('foo', 'bar', 'MB/s', {foo: 'bar', baz: {hi: 'there'}});
};

tests["does not throw an error if emitter is not specified but event is"] = function (test) {
    test.expect(1);
    test.doesNotThrow(function () {
        var telemetry = new TelemetryEvents({
            event: 'foo',
            package: {
                name: "package-name",
                version: "package-version"
            }
        });
        telemetry.metric('foo', 'bar', 'MB/s', {foo: 'bar', baz: {hi: 'there'}});
    })
    test.done();
};

tests["does not throw an error if custom is not specified"] = function (test) {
    test.expect(1);
    test.doesNotThrow(function () {
        var telemetry = new TelemetryEvents({
            event: 'foo',
            package: {
                name: "package-name",
                version: "package-version"
            }
        });
        telemetry.metric('foo', 'bar', 'MB/s');
    })
    test.done();
};
