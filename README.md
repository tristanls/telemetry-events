# telemetry-events

_Stability: 1 - [Experimental](https://github.com/tristanls/stability-index#stability-1---experimental)_

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

```

## Tests

    npm test

## Documentation

  * [TelemetryEvents](#telemetryevents)

### TelemetryEvents

**Public API**

  * [new TelemetryEvents(config)](#new-telemetryeventsconfig)
  * [telemetry.emit(event)](#telemetryemitevent)

### new TelemetryEvents(config)

  * `config`: _Object_
    * `package`: _Object_ Contents of `package.json`.
      * `name`: _String_ Module name.
      * `version`: _String_ Module version.
    * `emitter`: _EventEmitter_ _(Default: undefined)_ An optional event emitter to emit events when `emit()` is called.
    * `eventName`: _String_ _(Default: 'telemetry')_ An optional event name used for event emission if `emitter` is specified.

Creates a new TelemetryEvents instance.

### telemetry.emit(event)

  * `event`: _Object_ Event to be emitted.
  * Return: _Object_ The event.

Adds or extends `event.provenance`. Adds `event.timestamp` if not present.

If `emitter` is not defined, this method does not emit the event. When `emitter` is defined, calling this method will emit the `event` using `eventName`, if provided, or "telemetry" (by default).
