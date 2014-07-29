var config     = require('../../config/config.json')
  , Tracking   = require('../models/tracking')
  , utils      = require('../common/utils')
  , useragent  = require('useragent');

/**
 * Saves the tracking data and responds to corresponding pixel (t.gif)
 *
 * @param   req   obj
 * @param   res   obj
 * @return  void
 */
exports.tracking = function (req, res) {
  var userAgent   = useragent.parse(req.headers['user-agent']).toJSON();
  var referrer    = req.protocol + '://' + req.headers['host'];

  if (utils.isHostAuthorized(config.whitelist, req.host) < 0 ||
    typeof req.param('t') === 'undefined' || 
    typeof req.param('d') === 'undefined') {
    utils.respondPixel(res);
    return;
  }

  var params = {
    type         : parseInt(escape(req.param('t')), 10),
    data         : JSON.parse(req.param('d')),
    environment  : escape(req.param('e'))
  }

  var dataModel = new Tracking({
    tracking_data : params.data,
    environment   : params.environment,
    user_agent    : userAgent,
    referrer      : referrer,
    created_at    : new Date,
    type          : params.type
  });

  dataModel.save( function (err, pixel) {
    if (err) return console.error(err);
    utils.respondPixel(res);
    console.log(('A tracking report has been caught successfully from '+ req.headers['host']).green);
  });

  function escape(data) {
    return String(data)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
  }
};
