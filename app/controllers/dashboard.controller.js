var Tracking   = require('../models/tracking')
  , _          = require('underscore')
  , async      = require('async')
  , aggregator = require('../common/aggregator')
  , formatter  = require('../common/formatter')
  , constants  = require('../common/constants')
  , utils      = require('../common/utils');

/**
 * Fetches tracking data from the database and renders stats page.
 * Both runtime and xhr errors for errors page,
 * and all types for the home page.
 *
 * @param   req   obj
 * @param   res   obj
 * @return  void
 */
exports.stats = function (req, res) {
  var statsType = req.params.type || 'all'
    , type      = constants.tracking_types[statsType] || constants.tracking_types[statsType.slice(0, -1)];

  if (typeof type === 'undefined') {
    return utils.errorPage(res);
  }

  async.parallel({
    errors: function (cb) {
      if (type === -1 || type === 0) {
        return Tracking.aggregate(aggregator.generic(0), function (err, result) {
          if (err) {
            return utils.errorPage(res);
          }
          return cb(null, result);
        });
      } else {
        return cb(null, null);
      }
    },
    events: function(cb) {
      if (type === -1 || type === 1) {
        return Tracking.aggregate(aggregator.generic(1), function (err, result) {
          if (err) {
            return utils.errorPage(res);
          }
          return cb(null, result);
        });
      } else {
        return cb(null, null);
      }
    },
    xhr: function(cb) {
      if (type === -1 || type === 0) {
        return Tracking.aggregate(aggregator.xhr(), function (err, result) {
          if (err) {
            return utils.errorPage(res);
          }
          return cb(null, result);
        });
      } else {
        return cb(null, null);
      }
    }
  },
  function (err, result) {
    if (err) {
      return res.render('error');
    }
    var flatten = _.flatten(_.filter(result, function (v) {
      return v !== null;
    }));

    res.render('stats', {
      data: formatter.formatStats(flatten),
      route: statsType
    });
  });
};
