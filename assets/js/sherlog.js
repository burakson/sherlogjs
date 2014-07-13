(function (win, doc) {
  'use strict';

  var methods = {
    // {{sherlog_url}} is to be replaced when compiled
    url   : '{{sherlog_url}}',
    pixel : 't.gif',

    /**
     * Prepares the data
     *
     * @param   data          obj
     * @param   environment   string
     * @param   type          number
     * @return  void
     */
    setup: function(data, environment, type) {
      this.type = type;
      this.environment = environment;
      if (this.type === 1 && typeof data !== 'object') {
        this.data = {
          _event : data
        }
      } else {
        this.data = (this.type === 1 ?
          data :
          {
            message : data[0],
            source  : data[1],
            line    : data[2]
          });
      }
    },

    /**
     * Returns the structured url with params
     *
     * @return  string
     */
    getUrl: function() {
      var params  = '&t=' + this.type + '&d=' +
                    encodeURIComponent(JSON.stringify( this.data )) +
                    '&e=' + encodeURIComponent( this.environment );
      return (win.location.protocol + '//'+ this.url + '/' +
              this.pixel + '?ts=' + (new Date().getTime()) + params);
    },

    /**
     * Injects the pixel into DOM and lets it fire!
     *
     * @param   url       string
     * @return  void
     */
    fire: function(url) {
      var img              = document.createElement('img');
      img.style.visibility = 'hidden';
      img.src              = url;
      doc.getElementsByTagName('body')[0].appendChild(img);
      img.parentNode.removeChild(img);
    }
  },
  sherlog = {

    /**
     * Error catcher gets the signal, prepares the data and fires the pixel
     *
     * @param   data          obj
     * @param   environment   string
     * @return  void
     */
    error: function(data, environment, cb) {
      if (typeof data === 'undefined' ||
          typeof data !== 'object') return;
      try {
        methods.setup(data, environment, 0);
        methods.fire(methods.getUrl());
        cb.call(this);
      } catch(e) {}
    },

    /**
     * Event catcher gets the signal and fires the pixel
     *
     * @param   data          obj
     * @param   environment   string
     * @return  void
     */
    push: function (data, environment, cb) {
      if (typeof data === 'undefined') return;
      try {
        methods.setup(data, environment, 1);
        methods.fire(methods.getUrl());
        cb.call(this);
      } catch(e) {}
    }
  };

  win._sherlog = sherlog;
  try {
    window._sherlogLoaded();
  } catch(e){};

}(window, document));