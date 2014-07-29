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

  if (utils.isHostAuthorized(config.whitelist, req.host) < 0 ||
    typeof req.param('t') === 'undefined' || 
    typeof req.param('d') === 'undefined') {
    utils.respondPixel(res);
    return;
  }

  var params = {
    tracking_data : JSON.parse(req.param('d')),
    environment   : escape(req.param('e')),
    user_agent    : useragent.parse(req.headers['user-agent']).toJSON(),
    referrer      : escape(req.protocol + '://' + req.headers['host']),
    resolution    : escape(req.param('cw')+'x'+req.param('ch')),
    created_at    : new Date,
    type          : parseInt(escape(req.param('t')), 10)
  }

  var trackingModel = new Tracking(params);
  trackingModel.save( function (err, pixel) {
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
