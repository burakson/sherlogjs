var config     = require('../../config/config.json')
  , Tracking   = require('../models/tracking')
  , utils      = require('../common/utils')
  , useragent  = require('useragent');

/**
 * Saves the tracking data and responds back with the pixel
 *
 * @param   req   obj
 * @param   res   obj
 * @return  void
 */
exports.tracking = function (req, res) {
  if (utils.isHostAuthorized(config.whitelist, req.hostname) < 0 ||
    typeof req.param('t') === 'undefined' || 
    typeof req.param('d') === 'undefined') {
    utils.respondPixel(res);
    return;
  }

  var params = {
    tracking_data : JSON.parse(req.param('d')),
    environment   : utils.escape(req.param('e')),
    user_agent    : useragent.parse(req.headers['user-agent']).toJSON(),
    referrer      : utils.escape(req.protocol + '://' + req.headers['host']),
    resolution    : utils.escape(req.param('cw')+ 'x'+ req.param('ch')),
    created_at    : new Date(),
    type          : parseInt(utils.escape(req.param('t')), 10)
  };

  var trackingModel = new Tracking(params);
  trackingModel.save( function (err, pixel) {
    if (err) {
      utils.respondPixel(res);
      return console.error(err);
    }
    console.log(('A tracking report has been caught successfully from '+ req.headers['host']).green);
    utils.respondPixel(res);
  });
};
