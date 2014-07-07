var Tracking      = require('../models/tracking')
  , utils         = require('../utils');

/**
 * Tracking details
 *
 * @param   req   obj
 * @param   res   obj
 * @return  void
 */
exports.details = function (req, res) {
  var id = req.params.id;

  if(!id) return;

  Tracking.findOne({ _id : req.params.id }, function (err, result) {
    if (err) return res.render('error');

    result.tracking_data = utils.stringify(result.tracking_data);
    res.render('details', {
      item: result,
      route: 'details'
    });
  });
}