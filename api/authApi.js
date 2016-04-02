var User   = require('../dbschema/User.js');
var tokend = require('./tokenApi.js'); 


exports.login = function(req , res){
	
	if(!req.body.userId||!req.body.password){	
		console.log('Login : ' + 'Invalid Data');
		return res.status(401).send({message : 'Unauthorized request'});
	}
	
	User.findOne({'auth.userId' : req.body.userId}, function(err , user){
		if(err) { console.log('Database Error'+err); return res.status(500).send({ message : 'Internal server error'}); }

		if(!user) { console.log('User does not exist'); return res.status(401).send({ message : 'User does not exist' }); }
		
		if(!user.validPassword(req.body.password)){
			return res.status(401).send({message : 'Password Incorrect'});	
		}
		
		var accessToken = tokend.newAuthToken(user._id);
		
		return res.status(200).send({ accessToken : accessToken })
		
	});


};







