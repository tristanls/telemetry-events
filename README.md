# telemetry-events

_Stability: 2 - [Stable](https://github.com/tristanls/stability-index#stability-2---stable)_

[![NPM version](https://badge.fury.io/js/telemetry-events.png)](http://npmjs.org/package/telemetry-events)

Helper for creating and emitting telemetry events.

## Contributors

[@tristanls](https://github.com/tristanls), [@lpearson05](https://github.com/lpearson05)

## Contents

  * [Installation](#installation)
  * [Usage](#usage)
  * [Tests](#tests)
  * [Documentation](#documentation)
    * [TelemetryEvents](#telemetryevents)
  * [Releases](#releases)

## Installation

    npm install telemetry-events

## Usage

To run the below example run:

    npm run readme

```javascript
"use strict";

var events = require('events');
var pkg = require('../package.json');
var TelemetryEvents = require('../index.js');

var emitter = new events.EventEmitter();

var telemetry = new TelemetryEvents({emitter: emitter, package: pkg});

emitter.on('telemetry', function (event) {
    console.dir(event);
});

telemetry.emit({type: 'log', level: 'info', message: 'hello info level'});
telemetry.emit({type: 'metric', name: 'web requests', target_type: 'counter', unit: 'Req', value: 1});

var _commonEventData = {
    method: "readme",
    provenance: [{module: "my-module"}]
};
telemetry.emit(_commonEventData,
{
    type: "log",
    level: "info",
    message: "info message using common event data"
});
telemetry.emit(_commonEventData,
{
    type: "metric",
    name: "metric with common event data",
    target_type: "counter",
    unit: "Call",
    value: 1
});

```

## Tests

    npm test

## Documentation

  * [TelemetryEvents](#telemetryevents)

### TelemetryEvents

**Public API**

  * [new TelemetryEvents(config)](#new-telemetryeventsconfig)
  * [telemetry.emit(\[common\], event)](#telemetryemitcommon-event)

### new TelemetryEvents(config)

  * `config`: _Object_
    * `package`: _Object_ Contents of `package.json`.
      * `name`: _String_ Module name.
      * `version`: _String_ Module version.
    * `emitter`: _EventEmitter_ _(Default: undefined)_ An optional event emitter to emit events when `emit()` is called.
    * `eventName`: _String_ _(Default: 'telemetry')_ An optional event name used for event emission if `emitter` is specified.

Creates a new TelemetryEvents instance.

### telemetry.emit([common], event)

  * `common`: _Object_ _(Default: undefined)_ Optional common data to clone and extend with the `event` data.
  * `event`: _Object_ Event to be emitted.
  * Return: _Object_ The event.

Adds or extends `event.provenance`. It is worth highlighting that `event.provenance` is a notion similar to a stack in a stack trace. In the case of `telemetry-events`, `event.provenance` is the stack of telemetry emitters. `event.provenance` is not intended to be used as a tracing feature. For tracing see [telemetry-events-trace](https://github.com/tristanls/telemetry-events-trace).

Adds `event.timestamp` if not present.

If `emit(event)` is given a single argument, it will be treated as `event` and `common` will be `undefined`.

If `emitter` is not defined, this method does not emit the event. When `emitter` is defined, calling this method will emit the `event` using `eventName`, if provided, or "telemetry" (by default).

## Releases

We follow semantic versioning policy (see: [semver.org](http://semver.org/)):

> Given a version number MAJOR.MINOR.PATCH, increment the:
>
>MAJOR version when you make incompatible API changes,<br/>
>MINOR version when you add functionality in a backwards-compatible manner, and<br/>
>PATCH version when you make backwards-compatible bug fixes.
