var Tracking      = require('../models/tracking')
  , utils         = require('../utils');

/**
 * Fetches data for dashboard interface
 *
 * @param   req   obj
 * @param   res   obj
 * @return  void
 */
exports.stats = function (req, res) {
  var statsType = req.params.type || 'all';

  // aggregate only for dashboard by group
  if (statsType === 'events' || statsType === 'errors') {
    var type = statsType === 'errors' ? 0 : 1;
    Tracking.find({ type: type }, {}, { $sort: { created_at : 1 }},  function (err, result) {
      if (err) return res.render('error');

      res.render('stats', {
        data: utils.formatStats(res, result),
        route: statsType
      });
    });
  } else {
    var agg = utils.aggregate();
    Tracking.aggregate(agg,
    function (err, result) {
      if (err) return res.render('error');
      
      res.render('stats_all', {
        data: utils.formatStats(res, result),
        route: statsType
      });
    });
  }
};
