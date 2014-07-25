var _  = require('underscore')
  , useragent  = require('useragent')
  , constants = require('./constants')
  , utils = require('./utils');

/**
 * Generic stats formatter for presentational reasons
 *
 * @param   data        obj
 * @return  array
 */
exports.formatStats = function(data) {
  return _.each(data, _.bind(function (item) {
    if (item._id) {
      item.tracking_data = item._id.tracking_data;
      item.environment = item._id.environment;
    }
    item.tracking_data  = item.tracking_data.message || utils.stringify(item.tracking_data);
    item.date = this.formatDate(item.created_at);
    item.type = _.invert(constants.tracking_types)[item.type];
  }, this));
};


/**
 * Formats History for details page
 *
 * @param   data        obj
 * @return  array
 */
exports.formatHistory = function(data) {
  return _.each(data, _.bind(function (item) {
    if (!item.created_at) return;
    item.date = this.formatDate(item.created_at);
  }, this));
};

/**
 * Single result formatter for details page
 *
 * @param   data        obj
 * @return  obj
 */
exports.formatDetails = function(data) {
  var clone = data.toObject();
  if (clone.type === constants.tracking_types['error']) {
    clone = _error(clone);
  } else if (clone.type === constants.tracking_types['event']) {
    clone = _event(clone);
  }
  // User Agent Formatting
  clone.type = _.invert(constants.tracking_types)[clone.type];
  clone.os = useragent.fromJSON(clone.user_agent).os.toString();
  clone.browser = useragent.fromJSON(clone.user_agent).toAgent();
  clone.device = useragent.fromJSON(clone.user_agent).device.toString();
  function _error(error) {
    error.title = error.tracking_data.message;
    error.line = error.tracking_data.line;
    error.source = error.tracking_data.source;
    return error;
  }
  function _event(evt) {
    evt.tracking_data = utils.stringify(evt.tracking_data);
    evt.title = evt.tracking_data;
    return evt;
  }
  return _.omit(clone, 'created_at', '_id', '__v');
};

/**
 * Converts date into more human readable format
 *
 * @param   date   obj
 * @return  string
 */
exports.formatDate = function(date) {
  if (typeof date !== 'object') return;
  date = date.toString().split(' ');
  return [date[2], date[1], date[3], date[4]].join(' ');
};
