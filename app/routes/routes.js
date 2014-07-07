module.exports.index = function(req, res) {
  res.redirect('/dashboard');
};

module.exports.tracker = function (req, res) {
  require('../controllers/tracking.controller').tracking(req, res);
};

module.exports.dashboard = function (req, res) {
  require('../controllers/dashboard.controller').stats(req, res);
}

module.exports.details = function (req, res) {
  require('../controllers/details.controller').details(req, res);
}

module.exports.notfound = function (req, res) {
  res.render('error');
}
