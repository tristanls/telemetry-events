/*

constructor.test.js - TelemetryEvents test

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

const TelemetryEvents = require('../index.js');

const VALID_CONFIG = {
    package: {
        name: "package-name",
        version: "package-version"
    }
};

const REQUIRED_CONFIG_PROPERTIES = ["package"];

it("instantiates with valid config", () =>
    {
        var telemetry = new TelemetryEvents(VALID_CONFIG);
        expect(telemetry instanceof TelemetryEvents).toBe(true);
    }
);

REQUIRED_CONFIG_PROPERTIES.map(property =>
    {
        it(`throws error if config is missing property: ${property}`, () =>
            {
                const config = JSON.parse(JSON.stringify(VALID_CONFIG));
                delete config[property];
                expect(() => new TelemetryEvents(config)).toThrow(Error);
            }
        );
    }
);

it("throws error if config has event specified without emitter specified", () =>
    {
        expect(() => new TelemetryEvents(
            {
                event: "all by myyyyselllllllllllf",
                package:
                {
                    name: "package-name",
                    version: "package-version"
                }
            }
        )).toThrow(Error);
    }
);
