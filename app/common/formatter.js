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
    if (item.type === constants.tracking_types['xhr']) {
      var p = _.pick(item._id.tracking_data, 'method', 'status', 'url');
      item.tracking_data = utils.stringify(p);
    } else {
      item.tracking_data = item._id.tracking_data.message || utils.stringify(item._id.tracking_data);
    }
    item.environment = item._id.environment;
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
    var ua = useragent.fromJSON(item.user_agent);
    item.browser = ua.family+' '+ua.major+'.'+ua.minor;
    item.os = ua.os.toString();
    item.date = this.formatDate(item.created_at);
    item.device = ua.device.toString();
  }, this));
};

/**
 * Single item formatter for details page
 *
 * @param   data        obj
 * @return  obj
 */
exports.formatDetails = function(data) {
  var clone = data.toObject();
  if (clone.type === constants.tracking_types['error']) {
    clone.title = clone.tracking_data.message;
    clone.line = clone.tracking_data.line;
    clone.source = clone.tracking_data.source;
  } else if (clone.type === constants.tracking_types['event']) {
    clone.tracking_data = utils.stringify(clone.tracking_data);
    clone.title = clone.tracking_data;
  } else if (clone.type === constants.tracking_types['xhr']) {
    clone.title = utils.stringify(clone.tracking_data.response);
    clone.method = clone.tracking_data.method;
    clone.status = clone.tracking_data.status;
    clone.url = clone.tracking_data.url;
  }
  clone.type = _.invert(constants.tracking_types)[clone.type];
  return _.omit(clone, 'created_at', '_id', '__v');
};

/**
 * Converts date into human readable format
 *
 * @param   date   obj
 * @return  string
 */
exports.formatDate = function(date) {
  if (typeof date !== 'object') return;
  date = date.toString().split(' ');
  return [date[2], date[1], date[3], date[4]].join(' ');
};
