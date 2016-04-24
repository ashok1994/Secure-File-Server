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

		// Video.aggregate([{$sample:{size:2}}], function(err, test){
			// console.log(err);
			// console.log(test);
			return res.status(200).send(videos);
		// });

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


exports.searchVideo = function(req, res){
	console.log(req.body.key);
	var key = req.body.key;
	Video.find({"name": new RegExp(key, 'i')}, function(err, vids){
		if(err){
			console.log(err);
			return res.status(500).send({message:"internal server error"});
		}
		console.log("Search result: "+vids.length);
		return res.status(200).send(vids);
	});
}

exports.getVideoDetails = function(req, res){
	var vidId = req.body.vidId;
	Video.findById(vidId).populate('user').exec(function(err, video){
		if(err){
			console.log(err);
			return res.status(500).send({message:"Internal Server Error"});
		}
		if(!video){
			return res.status(401).send({message:"Unauthorized"});
		}
		return res.status(200).send(video);
	});
}

exports.getlatestVideos = function(req, res){
	Video.find({})
	.sort({'uploadedOn': -1})
	.limit(10)
	.exec(function(err, videos){
		if(err){
			console.log(err);
			return res.status(500).send({message:"Internal Server Error"});
		}
		if(!videos){
			return res.status(401).send({message:"Unauthorized"});
		}
		return res.status(200).send(videos);
	});
}

exports.postLike = function(req, res){
	if(!req.headers.access_token){
		return res.status(401).send({message:"Unauthorized"});
	}
	var vidId = req.body.vidId;
	var userId = tokend.getUserIdFromToken(req.headers.access_token);
	Video.findById(vidId, function(err, vid){
		if(err){
			console.log(err);
			return res.status(500).send({message:"Internal Server Error"});
		}
		if(!vid){
			console.log("Unauthorized");
			return res.status(520).send({message:"Unknown error"});
		}
		if(vid.likes.indexOf(userId) ==  -1){
			vid.likes.push(userId);
			vid.save(function(err, vids){
				if(err){
					console.log(err);
					return res.status(500).send({message:"Internal Server Error"});
				}
				return res.status(200).send(vids);
			});
		}else{
			vid.likes.splice(vid.likes.indexOf(userId), 1)
			vid.save(function(err, vids){
				if(err){
					console.log(err);
					return res.status(500).send({message:"Internal Server Error"});
				}
				return res.status(200).send(vids);
			});
		}
	});
}

exports.postComment = function(req, res){
	if(!req.headers.access_token){
		return res.status(401).send({message:"Unauthorized"});
	}
	var vidId    = req.body.vidId;
	var comment  = req.body.comments;
	console.log(req.body.comments);
	console.log("-----");
	var userId = tokend.getUserIdFromToken(req.headers.access_token);
	Video.findById(vidId, function(err, vid){
		if(err){
			console.log(err);
			return res.status(500).send({message:"Internal Server Error"});
		}
		if(!vid){
			console.log("Unauthorized");
			return res.status(520).send({message:"Unknown error"});
		}
		vid.comments.push(comment);
		vid.save(function(err, vids){
			if(err){
				console.log(err);
				return res.status(500).send({message:"Internal Server Error"});
			}
			return res.status(200).send(vids);
		});
	});

}

exports.getMyVideos = function(req, res){
	var access_token = req.headers.access_token || null;
	if(!access_token){
		return res.status(401).send({message:"Unauthorized"});
	}
	var userId = tokend.getUserIdFromToken(access_token);
	Video.find({user: userId}, function(err, videos){
		if(err){
			console.log(err);
			return res.status(500).send({message:"Internal Server Error"});
		}
		return res.status(200).send(videos);
	});
}

exports.delete = function(req, res){
	var access_token = req.headers.access_token || null;
	if(!access_token){
		return res.status(401).send({message:"Unauthorized"});
	}
	var userId = tokend.getUserIdFromToken(access_token);
	var vidId  = req.body.vidId;
	var vidPath= req.body.vidPath;
	var thumbPath = req.body.thumbPath;
	Video.remove({"_id": vidId}, function(err){
		if(err){
			console.log(err);
			return res.status(500).send({message:"Internal Server Error"});
		}

		fs.remove(config.USER_DATA_FOLDER+'/videos/'+vidPath, function(err){
			if (err){
				console.log(err);
			}
			fs.remove(config.USER_DATA_FOLDER+'/images'+thumbPath, function(err){
				if(err){
					console.log(err);
				}
				return res.status(200).send("done");
			});
		});

	});

}
