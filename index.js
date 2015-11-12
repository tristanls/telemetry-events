/*

index.js: telemetry-events

The MIT License (MIT)

Copyright (c) 2014-2015 Tristan Slominski, Leora Pearson

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

var clone = require("clone");
var extend = require("extend");

module.exports = TelemetryEvents;

var REQUIRED_CONFIG_PROPERTIES = ["package"];

/*
  * `config`: _Object_
    * `package`: _Object_ Contents of `package.json`.
      * `name`: _String_ Module name.
      * `version`: _String_ Module version.
    * `emitter`: _EventEmitter_ _(Default: undefined)_ An optional event emitter to emit events when `emit()` is called.
    * `eventName`: _String_ _(Default: 'telemetry')_ An optional event name used for event emission if `emitter` is specified.
*/
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
        self._eventName = config.eventName || "telemetry";
    } else {
        if (config.event) {
            throw new Error("'eventName' property specified in 'config' without corresponding 'emitter' property");
        }
    }
};

/*
  * `scaffold`: _Object_ _(Default: undefined)_ Optional scaffold to clone and
      extend with the `event` data.
  * `event`: _Object_ Event to be emitted.
  * Return: _Object_ The event.
 */
TelemetryEvents.prototype.emit = function emit(scaffold, event)
{
    var self = this;
    if (event === undefined)
    {
        event = scaffold;
    }
    else
    {
        event = extend(true, clone(scaffold), event);
    }

    if (!event.provenance) {
        event.provenance = [];
    }
    if (!event.timestamp) {
        event.timestamp = new Date().toISOString();
    }

    event.provenance.push({
        module: self._package.name,
        version: self._package.version
    });

    if (self._emitter) {
        process.nextTick(function() {
            self._emitter.emit(self._eventName, event);
        });
    }

    return event;
};
