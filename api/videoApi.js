var User    = require('../dbschema/User.js');
var Video   = require('../dbschema/Video.js');
var tokend  = require('./tokenApi.js');
var request = require("request"); 
var fs      = require("fs-extra");
var path    = require("path");
var config  = require("../config.js");



exports.getVideos = function(req, res){
	var userId = null;
	if(req.headers.access_token){
		userId = tokend.getUserIdFromToken(req.headers.access_token);
	}
	Video.find({$or:[{"public":"Yes"},{"user": userId}]}, function(err, videos){
		if(err){
			console.log(err);
			return res.status(500).send({message:"Internal Server Error"});
		}
		console.log("videos :"+videos.length);

		Video.aggregate([{$sample:{size:2}}], function(err, test){
			console.log(err);
			console.log(test);
			return res.status(200).send(videos);
		});

	});
}


exports.streamVideo = function(req, res){
	
	Video.findById(req.params.vidId, function(err, vid){
		if(err){
			console.log(err);
			return res.status(500).send({message:"Internal Server Error"});
		}
		var videoPath = vid.path;
		var filePath = path.join(config.USER_DATA_FOLDER, 'public', 'videos', videoPath);
		console.log(filePath);

		var file = path.resolve(filePath);
	    fs.stat(file, function(err, stats) {
	      	if (err) {
	        	if (err.code === 'ENOENT') {
	        	  // 404 Error if file not found
	        	  return res.sendStatus(404);
	        	}
	      		res.end(err);
	      	}
	      	console.log(req.headers.range);
	      	var range = req.headers.range;
	      	if (!range) {
	      	 	// 416 Wrong range
	       		// return res.sendStatus(416);
	      		var start     = 0;
	      		var end       = stats.size-1;
	      		var total = stats.size;
	      		var chunksize = (end - start) + 1;
	      	}else{

	      		var positions = range.replace(/bytes=/, "").split("-");
	      		var start = parseInt(positions[0], 10);
	      		var total = stats.size;
	      		var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
	      		var chunksize = (end - start) + 1;
	      	}

	      	res.writeHead(206, {
	        	"Content-Range": "bytes " + start + "-" + end + "/" + total,
	        	"Accept-Ranges": "bytes",
	        	"Content-Length": chunksize,
	        	"Content-Type": "video/mp4"
	      	});

	      	var stream = fs.createReadStream(file, { start: start, end: end })
	        .on("open", function() {
	         	 stream.pipe(res);
	        })
	        .on("error", function(err) {
	          res.end(err);
	        });
	    });


		// return res.status(420).send("ok");
	});
}