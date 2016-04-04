var express = require('express');
var router = express.Router();


var authApi = require('../api/authApi.js');
/* GET home page. */





router.post('/api/login', authApi.login);
router.post('/api/logout', authApi.logout);


router.get('*', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
