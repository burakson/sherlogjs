# Sherlog.js
Javascript error and event tracker application.

***ATTENTION:*** *This project is under heavy development. Things may break until the stable release.*

## Features
  - Tracks javascript errors
  - Tracks erroneous ajax requests
  - Tracks custom events
  - Advanced Reporting Dashboard
  - Lightweight framework (~2KB Minified)

## Prerequisites
  - Node
  - Npm
  - MongoDB

## Installation
```
$ git clone git://github.com/burakson/sherlogjs.git
$ cd sherlogjs
$ npm install && bower install
```

## Configuration & Usage
- Open `config/config.json` and configure the application
- Hit `gulp` to prepare the framework
- Start the server: `$ node server.js`
- Add the framework's script into your web document before any `<script>` tag
    ```<script src="sherlog.min.js" data-environment="production"></script>````
- Done! Sherlog is now tracking errors.

#### API
Sherlog provides a public method as shown in the below examples.

```
_sherlog.push( String/Object , callback )
```

**Example 1:**

```javascript
_sherlog.push({
    username: 'John Doe',
    age: 35,
    action: 'Clicked on an image'
}, function() {
    // event tracking is done.
});
```

**Example 2:**
```javascript
_sherlog.push('User visits About us page.', function() {
    // event tracking is done.
});
```

## License
[MIT License](http://en.wikipedia.org/wiki/MIT_License) © [Burak Son](http://twitter.com/burakson)
