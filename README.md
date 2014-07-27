# Sherlog.js
A client-side error and event tracker application.

**ATTENTION:** This project is under heavy development. Things may break until the stable release.

## Prerequisites
  - Node
  - Npm
  - MongoDB

## Installation
```
$ git clone git://github.com/burakson/sherlogjs.git
$ cd sherlogjs
$ npm install && bower install && gulp
```

## Configuration & Usage
- Open `config/config.json` and change the configuration
- Hit `gulp` to prepare the framework
- Start the server: `$ node server.js`

#### Error Tracker
Add the required snippet before any `<script>` tag so the framework can catch any runtime errors.

*See `examples/example-error.html` for an example implementation*

#### Event Tracker
Events are intentionally triggered on the client-side in order to log spesific events.

*See `examples/example-event.html` for an example implementation*

## What's next?
* Unit tests
* Archiving/Removing errors/events
* XHR Tracking
* Dashboard improvements
    * Graphs
    * Password protection

## License
[MIT License](http://en.wikipedia.org/wiki/MIT_License) © [Burak Son](http://twitter.com/burakson)
