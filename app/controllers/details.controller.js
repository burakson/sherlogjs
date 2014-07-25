var Tracking      = require('../models/tracking')
  , formatter     = require('../common/formatter')
  , utils         = require('../common/utils')
  , async         = require('async');

/**
 * Tracking details
 *
 * @param   req   obj
 * @param   res   obj
 * @return  void
 */
exports.details = function (req, res) {
  var id = req.params.id;

  if(!id) return res.render('error');

  var trackingData = {};
  async.series({
      item: function (callback) {
        return Tracking.findOne({_id : id}, function (err, result) {
          trackingData = result.tracking_data;
          return callback(null, result);
        });
      },
      history: function (callback) {
        return Tracking.find({ tracking_data: trackingData }, 'created_at', function (err, results) {
          return callback(null, results);
        });
      }
    }, function (err, results){
      if( err ) { res.render('error'); }
      res.render('details', {
        item: formatter.formatDetails(results.item),
        history: formatter.formatHistory(results.history),
        route: results.type === 0 ? 'errors' : 'events'
      });
  });
}
