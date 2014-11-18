/*

readme.js: example from the README

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
var pkg = require('../package.json');
var TelemetryEvents = require('../index.js');

var emitter = new events.EventEmitter();

var telemetry = new TelemetryEvents({emitter: emitter, package: pkg});

emitter.on('telemetry', function (event) {
    console.dir(event);
});

telemetry.log('info', 'hello info level');
telemetry.log('warn', 'hello warn level');
telemetry.log('error', 'hello error with custom data', {custom: 'data'});

telemetry.metric('request-count', 132, 'Req/s');
telemetry.metric('error-count', 3, 'Err/s', {instance: 'i-324fd24a'});
