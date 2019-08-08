/*

emit.test.js - TelemetryEvents.emit() test

The MIT License (MIT)

Copyright (c) 2014-2019 Tristan Slominski, Leora Pearson

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

const clone = require("clone");
const events = require('events');
const TelemetryEvents = require('../index.js');

it("does not throw if emitter is not specified", () =>
    {
        const event = {};
        const telemetry = new TelemetryEvents(
            {
                package:
                {
                    name: "package-name",
                    version: "package-version"
                }
            }
        );
        expect(() => telemetry.emit(event)).not.toThrow(Error);
    }
);

it("emits 'telemetry' event if emitter is specified but eventName is not", done =>
    {
        const emitter = new events.EventEmitter();
        const event = {};
        const telemetry = new TelemetryEvents(
            {
                emitter,
                package:
                {
                    name: "package-name",
                    version: "package-version"
                }
            }
        );
        emitter.on("telemetry", e =>
            {
                expect(e).toBe(event);
                done();
            }
        );
        telemetry.emit(event);
    }
);

it("emits <eventName> event if emitter and eventName are specified", done =>
    {
        const emitter = new events.EventEmitter();
        const event = {};
        const telemetry = new TelemetryEvents(
            {
                emitter,
                eventName: "my-telemetry",
                package:
                {
                    name: "package-name",
                    version: "package-version"
                }
            }
        );
        emitter.on("my-telemetry", e =>
            {
                expect(e).toBe(event);
                done();
            }
        );
        telemetry.emit(event);
    }
);

it("returns event with provenance and timestamp", () =>
    {
        const event = {};
        const telemetry = new TelemetryEvents(
            {
                package:
                {
                    name: "package-name",
                    version: "package-version"
                }
            }
        );
        const returnedEvent = telemetry.emit(event);
        expect(returnedEvent).toBe(event);
        expect(returnedEvent.provenance).toBeInstanceOf(Array);
        expect(typeof returnedEvent.timestamp).toBe("string");
        expect(() => new Date(returnedEvent.timestamp)).not.toThrow();
    }
);

it("does not override exisitng timestamp", () =>
    {
        const telemetry = new TelemetryEvents(
            {
                package:
                {
                    name: "package-name",
                    version: "package-version"
                }
            }
        );
        const timestamp = "0";
        const returnedEvent = telemetry.emit(
            {
                timestamp
            }
        );
        expect(returnedEvent.timestamp).toBe(timestamp);
    }
);

it("returns event with extended provenance", () =>
    {
        const telemetry = new TelemetryEvents(
            {
                package:
                {
                    name: "package-name",
                    version: "package-version"
                }
            }
        );
        const event = telemetry.emit(
            {
                provenance:
                [
                    {}
                ]
            }
        );
        expect(event.provenance.length).toBe(2);
        expect(event.provenance[1].module).toBe("package-name");
        expect(event.provenance[1].version).toBe("package-version");
    }
);

it("clones and extends common data if provided without altering the original", () =>
    {
        const telemetry = new TelemetryEvents(
            {
                package:
                {
                    name: "package-name",
                    version: "package-version"
                }
            }
        );
        const common =
        {
            some: "common data",
            with:
            {
                some: "data"
            }
        };
        const original = clone(common);
        const event = telemetry.emit(
            common,
            {
                my: "event",
                with:
                {
                    more: "data"
                }
            }
        );
        expect(event).toEqual(
            {
                my: "event",
                provenance:
                [
                    {
                        module: "package-name",
                        version: "package-version"
                    }
                ],
                some: "common data",
                timestamp: expect.any(String),
                with:
                {
                    more: "data",
                    some: "data"
                }
            }
        );
        expect(new Date(event.timestamp).toISOString()).toBe(event.timestamp);
        expect(common).toEqual(original);
    }
);
