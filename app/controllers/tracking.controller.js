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
  var referrer    = req.protocol + '://' + req.headers.host;
  var environment = req.param('e') === 'development' ? 'development' : 'production';

  if (utils.isHostAuthorized(config.whitelist, req.hostname) < 0
      || typeof req.param('t') === 'undefined'
      || typeof req.param('d') === 'unfedined') {
    utils.respondPixel(res);
    return;
  }

  var params    = {
    type         : parseInt(req.param('t'), 10),
    data         : JSON.parse(req.param('d')),
    environment  : environment
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
};
