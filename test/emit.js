/*

emit.js - TelemetryEvents.emit() test

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

tests["does not throw if emitter is not specified"] = function (test) {
    test.expect(1);
    var event = {};
    var telemetry = new TelemetryEvents({
            package: {
                name: "package-name",
                version: "package-version"
            }
        });
    test.doesNotThrow(function () {
        telemetry.emit(event);
    });
    test.done();
};

tests["emits 'telemetry' event if emitter is specified but eventName is not"] = function (test) {
    test.expect(1);
    var emitter = new events.EventEmitter();
    var event = {};
    var telemetry = new TelemetryEvents({
            emitter: emitter,
            package: {
                name: "package-name",
                version: "package-version"
            }
        });
    emitter.on('telemetry', function (e) {
        test.strictEqual(e, event, "THIS IS WHY WE CAN'T HAVE NICE THINGS!!!");
        test.done();
    });
    telemetry.emit(event);
};

tests["emits <eventName> event if emitter and eventName are specified"] = function (test) {
    test.expect(1);
    var emitter = new events.EventEmitter();
    var event = {};
    var telemetry = new TelemetryEvents({
            emitter: emitter,
            eventName: 'my-telemetry',
            package: {
                name: "package-name",
                version: "package-version"
            }
        });
    emitter.on('my-telemetry', function (e) {
        test.strictEqual(e, event, "THIS IS WHY WE CAN'T HAVE NICE THINGS!!!");
        test.done();
    });
    telemetry.emit(event);
};

tests['returns event with provenance and timestamp'] = function (test) {
    test.expect(4);
    var telemetry = new TelemetryEvents({
            package: {
                name: "package-name",
                version: "package-version"
            }
        });
    var event = {};
    var returnedEvent = telemetry.emit(event);
    test.strictEqual(event, returnedEvent, "didn't return the passed event");
    test.ok(returnedEvent.provenance instanceof Array, "should've added 'event.provenance'");
    test.ok(typeof returnedEvent.timestamp === "string", "should've added 'event.timestamp'");
    test.doesNotThrow(function() {
        new Date(returnedEvent.timestamp);
    });
    test.done();
};

tests['does not override existing timestamp'] = function (test) {
    test.expect(1);
    var telemetry = new TelemetryEvents({
            package: {
                name: "package-name",
                version: "package-version"
            }
        });
    var timestamp = "0";
    var returnedEvent = telemetry.emit({timestamp: timestamp});
    test.strictEqual(returnedEvent.timestamp, timestamp, "didn't preserve existing 'timestamp'");
    test.done();
};

tests['returns event with extended provenance'] = function (test) {
    test.expect(3);
    var telemetry = new TelemetryEvents({
            package: {
                name: "package-name",
                version: "package-version"
            }
        });
    var event = telemetry.emit({provenance: [{}]});
    test.equal(event.provenance.length, 2, "should've added additional entry to 'event.provenance'");
    test.equal(event.provenance[1].module, "package-name");
    test.equal(event.provenance[1].version, "package-version");
    test.done();
};
