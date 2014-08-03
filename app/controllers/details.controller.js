var Tracking      = require('../models/tracking')
  , formatter     = require('../common/formatter')
  , utils         = require('../common/utils')
  , async         = require('async')
  , _             = require('underscore')
  , constants     = require('../common/constants');

/**
 * Tracking details
 *
 * @param   req   obj
 * @param   res   obj
 * @return  void
 */
exports.details = function (req, res) {
  var id           = req.params.id
    , trackingData = {};

  if(!id) return returnError();

  function returnError() {
    res.render('error');
  }

  async.series({
      item: function (callback) {
        return Tracking.findOne({_id : id}, function (err, result) {
          if (err || result === null)
          {
            returnError();
            return;
          }
          trackingData = result.tracking_data;
          return callback(null, result);
        });
      },
      browsers: function(callback) {
        return Tracking.aggregate([
          { $match: { 'tracking_data': trackingData } },
          { $sort: { created_at : 1 }},
          { $group: {
              _id: {
                user_agent: '$user_agent'
              },
              sum: { $sum: 1 }
            }
          }
        ], function (err, results) {
          if (err) returnError();
          return callback(null, results);
        });
      },
      history: function (callback) {
        return Tracking.find({ tracking_data: trackingData }, { 'user_agent': 1, 'created_at': 1, 'resolution': 1 }, function (err, results) {
          if (err) returnError();
          return callback(null, results);
        });
      }
    }, function (err, results){
      var route;
      if (err) returnError();
      if (results.item.type === constants.tracking_types['xhr'] ||
          results.item.type === constants.tracking_types['error']) {
        route = 'errors'
      } else {
        route = 'events';
      }
      res.render('details', {
        item                : formatter.formatDetails(results.item),
        browsers            : results.browsers,
        history             : formatter.formatHistory(results.history),
        occurence_count     : results.history.length,
        last_occurence_date : formatter.formatDate(results.history.slice(-1)[0].created_at),
        route               : route
      });
  });
}
