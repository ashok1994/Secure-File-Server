var User    = require('../dbschema/User.js');
var Video   = require('../dbschema/Video.js');
var tokend  = require('./tokenApi.js');
var request = require("request"); 
var fs      = require("fs-extra");
var path    = require("path");
var config  = require("../config.js");

var ffmpeg = require('ffmpeg');

exports.login = function(req , res){

	if(!req.body.user.id||!req.body.user.password){
		console.log('Login : ' + 'Invalid Data');
		return res.status(401).send({message : 'Unauthorized request'});
	}

	User.findOne({'auth.userId' : req.body.user.id}, function(err , user){
		if(err) { console.log('Database Error'+err); return res.status(500).send({ message : 'Internal server error'}); }

		if(!user) { console.log('User does not exist'); return res.status(401).send({ message : 'User does not exist' }); }

		if(!user.validPassword(req.body.user.password)){
			return res.status(401).send({message : 'Password Incorrect'});
		}

		var accessToken = tokend.newAuthToken(user._id);

		return res.status(200).send({ accessToken : accessToken});

	});


};


exports.logout = function( req , res){
	console.log(req.headers.access_token);
	tokend.removeToken(req.headers.access_token);
	return res.status(200).send({ message : 'Logged out' });
}


exports.getGmailId = function(req,res){
    var code         = req.body.code;
    var redirect_uri = req.body.redirect_uri;
    // console.log(code);
    var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
    var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
    var params = {
        code: req.body.code,
        client_id: '<Client-ID>',
        client_secret: "<Client-Secret>",

        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
    };
    request.post(accessTokenUrl,{json:true,form:params},function(err,response,token){

        if(err) {
            console.log("getGmailId Unknown: " + err);
            return res.status(401).send({ message:'No response from google.' })
        }

        //console.log(token.access_token);
        var access_token = token.access_token;
        var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
        var headers = { Authorization: 'Bearer ' + access_token };
        // Retrieve profile information about the current user.
        request.get({ url: peopleApiUrl, headers: headers, json: true },function(err,response,profile){
            if(!err) {
                return res.status(200).send(profile);
            }
            console.log("getGmailId Unknown: " + err);
            return res.status(401).send({ message:'No response from google server.' })
        });
    });
}



exports.signup = function(req, res) {


   
   

    var userName             = req.body.userName;
    var userEmail            = req.body.userEmail;
    var verificationRequired = req.body.verificationRequired||false;
    //query must be of an object type
    var loginType = {};
    // loginType[!Number(userEmail) ? 'email' : 'registeredPhoneNumber'] = userEmail;
    User.findOne({'email': userEmail}, function(err, user) {
        if (err)
          return res.status(500).send( { message: "Server Error!" } );
        if(user) {

            if(verificationRequired){

                return res.status(401).send( { message : "Userid already exists!" } );
            }
            else{
                var token = tokend.newAuthToken(user._id);
                console.log(token);
                return res.status(200).send({access_token:token , user:user,userEmail:userEmail,message:'Successfully Logged In' , registeredPhoneNumber : user.registeredPhoneNumber || '' });
            }

        } else {

            var password = req.body.password;
            var role =     req.body.role || "user";
            

            var newUser            = new User();
            newUser.name           = userName;

            if (!Number(userEmail)) { newUser.email    = userEmail; }
            else { newUser.registeredPhoneNumber = userEmail; }

            if(verificationRequired){
                   newUser.local.password = newUser.generateHash(password);
            }

            newUser.role           = role;

            if(!verificationRequired){
               
                newUser.password      = newUser.generateHash('anksoanksoankso');
            }

            newUser.save(function(err,user) {
                if (err)
                return res.status(500).send( { message : "Server error/Database" } );
                


                console.log("loggedInActive");    
                return res.status(200).send( { access_token: token,user:user, userEmail: userEmail,user:user, message: "Registration successful." , registeredPhoneNumber : user.registeredPhoneNumber || ''});
                    
            });

        }
    });
};


exports.postFile = function(req,res){
    // console.log(req.headers.access_token);
    console.log("1----");
    var access_token = req.headers.access_token;
    var userid   = tokend.getUserIdFromToken(access_token);
    console.log(userid+"--------");
    var name = req.headers.name || "unnamed";
    var mimeAccept;
    var newFileName = new Date().getTime();
    var savepath;
    var destPath;
    console.log(name);
    if(!req.busboy){
        log.error('Request does not have busboy!!!');
        return res.status(400).send({message:'Bad request. Busboy not found.'});
    }
    // BEGIN: req.busboy.on.file
    req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {

        var knownFormats = [ 'video/mp4', 'video/3gp', 'video/avi', 'video/wmv',
                             'video/x-flv', 'video/ogg', 'video/webm'
                              ];

        // BEGIN: Event.findById
        User.findById(userid,function(err, user) {

            if (err) {
                console.log(err+'--------------------------');
                return res.status(500).send({message:'Internal Server Error.'});
            }

            // extract 'image'(mimeAccept) from 'image/jpeg'(mimetype)
            mimeAccept = mimetype.substring(0, mimetype.indexOf('/'));
            // destpath = <APP-ROOT>/userdata/public/<uid>/events/<eid>
            destPath = path.join(config.USER_DATA_FOLDER, 'public');

            //log.debug("Accepting file: " + filename);
            savepath = path.join(destPath, mimeAccept+'s');
            //log.debug("Storing " + filename + " at " + savepath);
            var ext = path.extname(filename);
            if (mimeAccept != "video") {
                log.debug(mimeAccept);
                log.error("Invalid mimetype: " + mimetype);
                res.writeHead(400,{Connection : 'close', 'message': 'Invalid File format.'});
                res.end('Invalid file format');
                return;
            }

            if (knownFormats.indexOf(mimetype) == -1) {
            //    log.debug("Accepted file format: " + mimetype);
            //} else {
                console.error(mimetype);
                console.warn(knownFormats.indexOf(mimetype));
                console.warn('Problematic file format: ' + mimetype);
            }
            // BEGIN: fs.mkdirs
            fs.mkdirs(savepath, function(err){
                if (err) {
                    console.error("fs.mkdirs: " + err);
                    return res.status(500).send({ message : 'Internal Server error!!!' });
                }
                newFileName += ext;
                file.pipe(fs.createWriteStream(savepath+'/'+newFileName));
            // END: fs.mkdirs
            });
        //END Event.findById
        });
    // END: req.busboy.on.file
    });

    req.busboy.on('finish', function () {

        var newVid = new Video();
        newVid.name = name;
        newVid.path = newFileName;
        newVid.user = userid;
        newVid.save(function(err, vid){
            if(err){
                // TODO: remove temp file
                console.log(err);
                return res.status(520).send({message:"Unknown Error"});
            }

            var imagePath = path.join(destPath, "images");
            
            try {
                var src = path.join(savepath, newFileName);
                var dst = imagePath;
                var process = new ffmpeg(src);
                var time = (new Date()).getTime();
                process.then(function (video) {
                    console.log("pass1");
                    // Callback mode
                    video.fnExtractFrameToJPG(dst, {
                        frame_rate : 1,
                        number : 1,
                        file_name : time+".jpg"
                        
                    }, function (error, files) {
                        if(error)console.log(error);
                        if (!error)
                            console.log('Frames: ' + files);
                        vid.thumbs = time+"_1.jpg";
                        vid.save(function(err, newVid){
                            console.log(err);
                            return res.status(200).send();
                        });
                    });
                }, function (err) {
                    console.log('Error: ' + err);
                });
            } catch (e) {
                console.log(e.code);
                console.log(e.msg);
            }
            
        });
     
    // END: req.busboy.on.finish
    });

    req.pipe(req.busboy);
}
