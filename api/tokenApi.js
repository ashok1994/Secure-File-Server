var jwt    =  require('jwt-simple');
var config =  require('../config.js');


var obj = { name : "Ashok" };
var tokens = [] ;


exports.newAuthToken = function(userId){
	var object = {
		userId : userId
	};


	object.expires = new Date((new Date()).getTime() + (1000*60*60*24));

	var encodedToken = jwt.encode(object, config.JWT_KEY);

	tokens.push(encodedToken);

	return encodedToken;
}




function decodeToken(accessToken){
	// console.log(accessToken);
	return jwt.decode(accessToken, config.JWT_KEY);
}

exports.decodeToken = decodeToken;




exports.removeToken =  function(accessToken){
	// console.log("------------"+tokens.length);
	if(tokens.indexOf(accessToken)!==-1) tokens.splice(tokens.indexOf(accessToken),1);
	// console.log("++++++++++++++++"+tokens);
	return;
}

exports.getUserIdFromToken = function(accessToken){
   // console.log("2----------"+accessToken, config.JWT_KEY||"helllll");
   var userObject  = jwt.decode(accessToken, config.JWT_KEY);
   // console.log(userObject);
   return userObject.userId
}



exports.requiresAuthentication = function( req , res , next){
	if(req.headers.access_token && tokens.indexOf(req.headers.access_token !== -1)){
		var decodedToken = decodeToken(req.headers.access_token);
		if(new Date(decodedToken.expires) < new Date()){
			next(req,res);
		}else{
			tokens.splice(tokens.indexOf(req.headers.access_token),1);
			return res.status(401).send({message : 'Unauthorized Request(Invalid Token)'});

		}
	}else{
		return res.status(401).send({message : 'Unauthorized Request(Invalid Token)'});
	}

}

exports.checkForToken = function(req, res) {

    if (!req.headers.access_token) 
        return res.status(401).send({ message: "Unauthorized request!" } );

    var decodedToken = decodeToken(req.headers.access_token);
    if(tokens.indexOf(decodedToken) === -1){
    	return res.status(401).send({message:"Invalid access_token"});
    }
    if (decodedToken && new Date(decodedToken.expires) > new Date()) {
        return res.status(200).send({message:"Valid access_token"});
    }
    return res.status(401).send({ message: "Expired session!" } );
};