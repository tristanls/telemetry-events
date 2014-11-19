/*

index.js: telemetry-events

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

module.exports = TelemetryEvents;

var REQUIRED_CONFIG_PROPERTIES = ["package"];

function TelemetryEvents(config) {
    var self = this;

    config = config || {};

    REQUIRED_CONFIG_PROPERTIES.forEach(function(property) {
        if (!(self["_" + property] = config[property])) {
            throw new Error("config is missing required property: " + property);
        }
    });

    self._emitter = config.emitter;
    if (self._emitter) {
        self._event = config.event || "telemetry";
    } else {
        if (config.event) {
            throw new Error("'event' property specified in 'config' without corresponding 'emitter' property");
        }
    }
};

TelemetryEvents.prototype.log = function log(level, message, custom) {
    var self = this;

    var event = {
        type: 'log',
        level: level,
        timestamp: new Date().toISOString(),
        module: self._package.name,
        version: self._package.version
    };
    // allow custom to be passed as second parameter
    if (message && typeof message != "string") {
        custom = message;
        message = null;
    }
    if (message) {
        event.message = message;
    }
    if (custom) {
        Object.keys(custom).forEach(function(property) {
            event[property] = custom[property];
        });
    }

    if (self._emitter) {
        self._emitter.emit(self._event, event);
    }

    return event;
};
