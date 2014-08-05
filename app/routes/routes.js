var modules = {

  index: function(req, res) {
    res.redirect('/dashboard');
  },

  login: function (req, res) {
    res.render('login');
  },

  logout: function (req, res) {
    req.logout();
    res.redirect('/');
  },

  tracker: function (req, res) {
    require('../controllers/tracking.controller').tracking(req, res);
  },

  dashboard: function (req, res) {
    require('../controllers/dashboard.controller').stats(req, res);
  },

  details: function (req, res) {
    require('../controllers/details.controller').details(req, res);
  },

  notfound: function (req, res) {
    res.render('error');
  }

};

module.exports = modules;
