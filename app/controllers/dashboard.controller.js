var Tracking      = require('../models/tracking')
  , utils         = require('../common/utils')
  , formatter     = require('../common/formatter')
  , constants     = require('../common/constants');

/**
 * Fetches data for dashboard interface
 *
 * @param   req   obj
 * @param   res   obj
 * @return  void
 */
exports.stats = function (req, res) {
  var statsType = req.params.type || 'all';
  var type = constants.tracking_types[statsType]
             || constants.tracking_types[statsType.slice(0, -1)];
  var agg  = utils.aggregate(type);

  Tracking.aggregate(agg,
    function (err, result) {
      if (err) return res.render('error');
      
      res.render('stats', {
        data: formatter.formatStats(result),
        route: statsType
      });
    }
  );
};
