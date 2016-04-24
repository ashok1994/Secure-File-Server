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
router.post('/api/searchVideo', videoApi.searchVideo);
router.post('/api/getlatestVideos', videoApi.getlatestVideos);
router.post('/api/getVideoDetails', videoApi.getVideoDetails);
router.post('/api/postLike', videoApi.postLike);
router.post('/api/postComment', videoApi.postComment);
router.post('/api/getMyVideos', videoApi.getMyVideos);
router.post('/api/delete', videoApi.delete);

router.get('*', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
