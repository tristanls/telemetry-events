/*

log.js - TelemetryEvents.log() test

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

tests['returns log event'] = function (test) {
    test.expect(8);
    var telemetry = new TelemetryEvents(VALID_CONFIG);
    var event = telemetry.log('info', "'ello", {foo: 'bar', baz: {hi: 'there'}});
    assertEqual(test, 'event.type', event.type, 'log');
    assertEqual(test, 'event.level', event.level, 'info');
    test.ok(event.timestamp, "Missing event.timestamp");
    assertEqual(test, 'event.module', event.module, 'package-name');
    assertEqual(test, 'event.version', event.version, 'package-version');
    assertEqual(test, 'event.message', event.message, "'ello");
    assertEqual(test, 'event.foo', event.foo, 'bar');
    test.deepEqual(event.baz, {hi: 'there'}, "expected value for event.baz was '" + JSON.stringify({hi: 'there'}) + "' but received '" + JSON.stringify(event.baz));
    test.done();
};

tests['allows custom to be passed as the second parameter instead of message'] = function (test) {
    test.expect(8);
    var telemetry = new TelemetryEvents(VALID_CONFIG);
    var event = telemetry.log('info', {foo: 'bar', baz: {hi: 'there'}});
    assertEqual(test, 'event.type', event.type, 'log');
    assertEqual(test, 'event.level', event.level, 'info');
    test.ok(event.timestamp, "Missing event.timestamp");
    assertEqual(test, 'event.module', event.module, 'package-name');
    assertEqual(test, 'event.version', event.version, 'package-version');
    test.ok(event.message === undefined, "expected value for event.message was undefined but received '" + event.message + "'");
    assertEqual(test, 'event.foo', event.foo, 'bar');
    test.deepEqual(event.baz, {hi: 'there'}, "expected value for event.baz was '" + JSON.stringify({hi: 'there'}) + "' but received '" + JSON.stringify(event.baz)) + "'";
    test.done();
};

tests["should call emit() to emit event"] = function (test) {
    test.expect(1);
    var _emitter = new events.EventEmitter();
    _emitter.emit = function () {
        test.ok(false, "emitter.emit() should not have been called directly");
    };
    var telemetry = new TelemetryEvents({
            emitter: _emitter,
            package: {
                name: "package-name",
                version: "package-version"
            }
        });
    var emittedEvent;
    telemetry.emit = function (event) {
        emittedEvent = event;
    };
    var actualEvent = telemetry.log('info', "'ello", {foo: 'bar', baz: {hi: 'there'}});
    test.strictEqual(emittedEvent, actualEvent, "What are you doing?");
    test.done();
};
