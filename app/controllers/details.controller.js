var Tracking      = require('../models/tracking')
  , formatter     = require('../common/formatter')
  , utils         = require('../common/utils')
  , async         = require('async')
  , _             = require('underscore')
  , constants     = require('../common/constants');

/**
 * Fetches single tracking details along with its occurences.
 *
 * @param   req   obj
 * @param   res   obj
 * @return  void
 */
exports.details = function (req, res) {
  var id           = req.params.id
    , trackingData = {}
    , type;

  if(!id) return utils.errorPage();

  async.series({
      item: function (cb) {
        return Tracking.findOne({_id : id}, function (err, result) {
          if (err || result === null) return utils.errorPage();
          trackingData = result.tracking_data;
          type = result.type;
          return cb(null, result);
        });
      },
      history: function (cb) {
        var query = {};
        if (type === 2) {
          query = {
            'tracking_data.response' : trackingData.response,
            'tracking_data.method'   : trackingData.method,
            'tracking_data.status'   : trackingData.status
          }
        } else {
          query = { tracking_data: trackingData }
        }
        return Tracking.find(query, { 'user_agent': 1, 'created_at': 1, 'resolution': 1 }, function (err, results) {
          if (err) utils.errorPage();
          return cb(null, results);
        });
      }
    }, function (err, results){
      var route;
      if (err) utils.errorPage();
      if (results.item.type === constants.tracking_types['xhr'] ||
          results.item.type === constants.tracking_types['error']) {
        route = 'errors'
      } else {
        route = 'events';
      }
      res.render('details', {
        item                : formatter.formatDetails(results.item),
        history             : formatter.formatHistory(results.history),
        occurence_count     : results.history.length,
        last_occurence_date : formatter.formatDate(results.history.slice(-1)[0].created_at),
        route               : route
      });
  });
}
