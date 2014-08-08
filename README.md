<p style="text-align: center">
  <img src="https://github.com/burakson/sherlogjs/blob/images/sherlog-logo.png?raw=true" alt="Sherlogjs">
</p>

# Sherlog.js
JavaScript error and event tracker application.

## Features
  - Tracks JavaScript errors
  - Tracks faulty ajax requests
  - Tracks custom events
  - Reporting dashboard
  - Lightweight tracking framework (~2KB Minified)

## Prerequisites
  - Node
  - Npm
  - Bower
  - Gulp
  - MongoDB

## Screenshots
![Dashboard Page](https://github.com/burakson/sherlogjs/blob/images/screenshot1.png?raw=true "Dashboard Page")
![Tracking Details Page](https://github.com/burakson/sherlogjs/blob/images/screenshot2.png?raw=true "Details Page")


## Installation
```
$ git clone git://github.com/burakson/sherlogjs.git
$ cd sherlogjs
$ npm install && bower install
```

## Configuration & Usage
- Copy `config/config.json.example` in `config/config.json` and configure the application
- Hit `gulp` to prepare the framework
- Start the server:

  ```$ npm start```
- Add the following script into your web document before any other `<script>` tag
```
<script src="sherlog.min.js" data-environment="production"></script>
```
- Done! Sherlog is now tracking errors.

#### API
Sherlog provides a public method for event tracking as shown in the below examples.

```
_sherlog.push( String/Object , callback )
```

**Example 1:**

```JavaScript
_sherlog.push({
    username: 'John Doe',
    age: 35,
    action: 'Clicked on an image'
}, function() {
    // event tracking pixel is fired.
});
```

**Example 2:**
```JavaScript
_sherlog.push('User has clicked to the button', function() {
    // event tracking pixel is fired.
});
```

## License
[MIT License](http://en.wikipedia.org/wiki/MIT_License) © [Burak Son](http://twitter.com/burakson)
