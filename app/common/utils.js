var _         = require('underscore')
  , constants = require('./constants');

_.str = require('underscore.string');

/**
 * Responds a binary file (image)
 *
 * @param   res   obj
 * @return  void
 */
exports.respondPixel = function(res) {
  var buffer = new Buffer(35);
  buffer.write('R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=', 'base64');
  res.send(buffer, {'Content-Type': 'image/gif'}, 200);
};

/**
 * Checks whether the request's host is whitelisted
 *
 * @param   whitelist   array
 * @param   host        string
 * @return  boolean
 */
exports.isHostAuthorized = function(whitelist, host) {
  return _.indexOf(whitelist, host);
};

/**
 * Converts tracking data to string and adds comma after each pair
 *
 * @param   obj      obj
 * @return  string
 */
exports.stringify = function(obj) {
  if (typeof obj !== 'object') return obj;
  var stringify = _.map(obj, function (value, key) {
    // _event key is only used when a string is passed on client's push method
    if(key==='_event') return _.str.capitalize(value)+'';
    if(typeof value === 'object') {
      value = JSON.stringify(obj, undefined, 4);
    }
    return _.str.capitalize(key)+': '+value;
  });
  return _.str.toSentence(stringify, ', ', ', ');
};

/**
 * Prepares an aggregation array to group events and errors
 *
 * @param   res         obj
 * @param   data        obj
 * @return  array
 */
exports.aggregate = function(type) {
  var agg     = [];

  if (type !== constants.tracking_types['all']) {
    var types = type === 1 ? [ 1 ] : [ 0, 2 ];
    var matcher = { $match: { type: { $in: types } }};
    agg.push(matcher);
  }

  agg.push(
    { $sort: { created_at : 1 }},
    { $group: {
        _id: {
          tracking_data   : '$tracking_data',
          environment     : '$environment'
        },
        id          : { $last: '$_id' },
        type        : { $last: '$type' },
        created_at  : { $last: '$created_at' },
        occurence   : { $sum: 1 }
      }
    })

  return agg;
};

/**
 * Escapes forbidden characters.
 *
 * @param   str         string
 * @return  string
 */
exports.escape = function(str) {
  return String(str).replace(/&/g, '&amp;')
                     .replace(/"/g, '&quot;')
                     .replace(/'/g, '&#39;')
                     .replace(/</g, '&lt;')
                     .replace(/>/g, '&gt;');
};
