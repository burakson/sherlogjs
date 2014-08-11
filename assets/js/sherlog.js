/* jshint unused: true, laxcomma: true, freeze: true, strict: true */
(function (win, doc, xhr) {
  'use strict';

  var Sherlog = {

    /**
     * Sets the resolution units and initializes the framework.
     *
     * @return  void
     */
    init: function() {
      this.environment();
      this.error();
      this.xhr();
    },

    /**
     * Sets the environment from the "data-environment" attribute of corresponding script tag.
     * NOTE: It will only find the attribute when the framework's source contains 'sherlog' keyword.
     *
     * @return  void
     */
    environment: function() {
      var s = doc.getElementsByTagName('script')
        , env;
      for( var i = 0, l = s.length; i < l; i++) {
        if (s[i].src.indexOf('sherlog') > -1) {
          env = s[i].getAttribute('data-environment');
          break;
        }
      }
      this.environment = env || '';
    },

    /**
     * Listens for the error events, fires the pixel as soon as catches one.
     *
     * @return  void
     */
    error: function() {
      var _this = this;
      win.onerror = function (m, u, l, c, e) {
        // TODO: Stack trace param (e) will not work in old browsers.
        var s = e ? e.stack : null;
        _this.format([m,u,l,c,s], 0);
        _this.inject();
      };
    },

    /**
     * Fires custom tracking events.
     *
     * @return  void
     */
    event: function(data) {
      this.format(data, 1);
      this.inject();
    },

    /**
     * Fires xhr error event once request returns 4xx or 5xx response.
     *
     * @return  void
     */
    xhr: function() {
      var _self = this
        , _open = xhr.prototype.open
        , _send = xhr.prototype.send
        , _method, _url, _timestamp;

      xhr.prototype.open = function(method, url) {
        _timestamp = new Date();
        _method = method;
        _url = url;
        _open.apply(this, arguments);
      };

      xhr.prototype.send = function() {
        var self = this;
        var cb = function(response) {
          if (self.readyState == 4) {
            try {
              var res
                , status = response.target.status.toString()
                , timeSpan = new Date() - _timestamp
                , isError = /^[45]/.test(status.slice(0, -2));
              if (!isError) {
                return;
              }
              try {
                res = JSON.parse(response.target.response);
              } catch(e) {
                res = response.target.response.substring(0, 100);
              }
              _self.format([_method, status, res, _url, timeSpan], 2);
              _self.inject();
            } catch(e){}
          }
        };
        this.addEventListener('readystatechange', cb, false);
        _send.apply(this, arguments);
      };
    },


    /**
     * Formats data to be sent to server according to tracking type.
     *
     * @param   data          obj
     * @param   type          number
     * @return  void
     */
    format: function(data, type) {
      this.type = type;

      switch (this.type) {
        case 0:
          this.data = {
            message : data[0],
            source  : data[1],
            line    : data[2],
            column  : data[3],
            stack   : data[4]
          };
          break;

        case 1:
          this.data = (typeof data !== 'object') ? { _event : data } : data;
          break;

        case 2:
          this.data = {
            method        : data[0],
            status        : data[1],
            response      : data[2],
            url           : data[3],
            response_time : data[4]
          };
          break;
      }
    },

    /**
     * Returns the structured url with params.
     *
     * @return  string
     */
    url: function() {
      var params  = '&t=' + this.type + '&d=' +
                    encodeURIComponent(JSON.stringify(this.data)) +
                    '&cw=' + screen.width + '&ch=' + screen.height +
                    '&e=' + encodeURIComponent(this.environment);
      return (win.location.protocol+'//{{sherlog_url}}/{{pixel_name}}?ts='+(new Date().getTime())+params);
    },

    /**
     * Injects the pixel into DOM.
     *
     * @return  void
     */
    inject: function() {
      var img = document.createElement('img');
      img.style.visibility = 'hidden';
      img.src = this.url();
      doc.getElementsByTagName('body')[0].appendChild(img);
      img.parentNode.removeChild(img);
    }

  };

  var Public = {
    /**
     * Public method for event tracker,  sends callback when the process is done.
     *
     * @param   data          obj
     * @param   cb            function
     * @return  void
     */
    push: function (data, cb) {
      if (typeof data === 'undefined') {
        return;
      }
      try {
        Sherlog.event(data);
        // Uses the default context for this.
        // We don't have anything to expose to the user, so we don't pass `this` as the callback context
        cb.call(null);
      } catch(e) {}
    }
  };

  Sherlog.init();

  win.Sherlog = win.Sherlog || Public;

}(window, document, XMLHttpRequest));
