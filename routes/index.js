var express = require('express');
var router = express.Router();


var authApi  = require('../api/authApi.js');
var videoApi = require('../api/videoApi.js');
/* GET home page. */





router.post('/api/getGmailId', authApi.getGmailId);
router.post('/api/logout', authApi.logout);
router.post('/api/signup', authApi.signup);
router.post('/api/postFile', authApi.postFile);
router.post('/api/getVideos', videoApi.getVideos);
router.get('/api/stream/:vidId', videoApi.streamVideo);



router.get('*', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
