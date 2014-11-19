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
    var _event = {};
    var telemetry = new TelemetryEvents({
            package: {
                name: "package-name",
                version: "package-version"
            }
        });
    test.doesNotThrow(function () {
        telemetry.emit(_event);
    });
    test.done();
};

tests["emits 'telemetry' event if emitter is specified but eventName is not"] = function (test) {
    test.expect(1);
    var _emitter = new events.EventEmitter();
    var _event = {};
    var telemetry = new TelemetryEvents({
            emitter: _emitter,
            package: {
                name: "package-name",
                version: "package-version"
            }
        });
    _emitter.on('telemetry', function (event) {
        test.strictEqual(event, _event, "THIS IS WHY WE CAN'T HAVE NICE THINGS!!!");
    });
    telemetry.emit(_event);
    test.done();
};

tests["emits <eventName> event if emitter and eventName are specified"] = function (test) {
    test.expect(1);
    var _emitter = new events.EventEmitter();
    var _event = {};
    var telemetry = new TelemetryEvents({
            emitter: _emitter,
            eventName: 'my-telemetry',
            package: {
                name: "package-name",
                version: "package-version"
            }
        });
    _emitter.on('my-telemetry', function (event) {
        test.strictEqual(event, _event, "THIS IS WHY WE CAN'T HAVE NICE THINGS!!!");
    });
    telemetry.emit(_event);
    test.done();
};
