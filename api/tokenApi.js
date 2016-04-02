var jwt    =  require('jwt-simple');
var config =  require('../config.js');


var obj = { name : "Ashok" };
var tokens = [] ;


exports.encodeToken = function(object){

	object.expires = new Date((new Date()).getTime() + (1000*60*60*24));
	var encodedToken = jwt.encode(object, config.JWT_KEY);
	tokens.push(encodedToken);

	return encodedToken;
}




function getUserIdFromToken = function(accessToken){

	return jwt.decode(accessToken, config.JWT_KEY);
}

exports.getUserIdFromToken = getUserIdFromToken;




exports.removeToken =  function(accessToken){
	
	if(tokens.indexOf(accessToken)!==-1) tokens.splice(accessToken);
	return;
}





export.requiresAuthentication = function( req , res , next){
	if(req.headers.access_token && tokens.indexOf(req.headers.access_token !== -1)){
		var decodedToken = getUserIdFromToken(req.headers.access_token);
		if(new Date(decodedToken.expires) < new Date()){
			next(req,res);
		}else{
			tokens.splice(tokens.indexOf(req.headers.access_token),1);
			return res.status(401).send({message : 'Unauthorized Request(Invalid Token)'}
		
		}
	}else{
		return res.status(401).send({message : 'Unauthorized Request(Invalid Token)'}
	}
	
}




