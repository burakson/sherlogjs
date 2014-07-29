(function (win, doc, xhr) {
  'use strict';

  var Sherlog = {
    /*
     * Name of the tracking pixel
     */
    pixel: 't.gif',

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
     * NOTE: It will only find the attribute when framework's source contains 'sherlog' keyword.
     *
     * @return  void
     */
    environment: function() {
      var s = doc.getElementsByTagName('script');
      var env;
      for(var i = 0, l = s.length; i < l; i++){
        if(s[i].src.indexOf('sherlog') > -1){
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
      var self = this;
      win.onerror = function (m, u, l) {
        self.format([m,u,l], 0);
        self.inject();
      }
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
      var _self = this;
      var _open = xhr.prototype.open;
      var _send = xhr.prototype.send;
      var _method, _url, _timestamp;

      xhr.prototype.open = function(method, url) {
        _timestamp = new Date();
        _method = method;
        _url = url;
        _open.apply(this, arguments);
      };

      xhr.prototype.send = function() {
        var self = this;
        var cb = function(response) {
          if(self.readyState == 4) {
            try {
              var res;
              var status = response.target.status.toString();
              var timeSpan = new Date - _timestamp;
              var isError = /^[45]/.test(status.slice(0, -2));
              if (!isError) return;
              try {
                res = JSON.parse(response.target.response);
              } catch(e) {
                res = response.target.response.substring(0, 100);
              }
              _self.format([_method, status, res, _url, timeSpan], 2);
              _self.inject();
            } catch(e){};
          }
        }
        this.addEventListener('readystatechange', cb, false);
        _send.apply(this, arguments);
      }
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
      if (this.type === 0) {
        this.data = {
          message : data[0],
          source  : data[1],
          line    : data[2]
        };
      } else if (this.type === 1 ) {
        this.data = (typeof data !== 'object') ? { _event : data } : data;
      } else if (this.type === 2 ) {
        this.data = {
          method        : data[0],
          status        : data[1],
          response      : data[2],
          url           : data[3],
          response_time : data[4]
        };
      }
    },

    /**
     * Returns the structured url with params.
     *
     * @return  string
     */
    url: function() {
      var params  = '&t='+this.type+'&d='+
                    encodeURIComponent(JSON.stringify(this.data))+
                    '&cw='+screen.width+'&ch='+screen.height+
                    '&e='+encodeURIComponent(this.environment);
      return (win.location.protocol+'//{{sherlog_url}}/'+this.pixel+'?ts='+(new Date().getTime())+params);
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

  },

  Public = {
    /**
     * Public method for event tracker,  sends callback when the process is done.
     *
     * @param   data          obj
     * @param   cb            function
     * @return  void
     */
    push: function (data, cb) {
      if (typeof data === 'undefined') return;
      try {
        Sherlog.event(data);
        cb.call(this);
      } catch(e) {}
    }
  };

  Sherlog.init();

  win._sherlog = win._sherlog || Public;

}(window, document, XMLHttpRequest));