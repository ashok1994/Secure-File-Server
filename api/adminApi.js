var User     = require('../dbschema/User.js');
var tokenApi = require('./tokenApi.js');
exports.addUser = function( req , res){
    var userId = tokenApi.getUserIdFromToken(req.headers.access_token);
    if(!userId) { console.error('addUser Error Invalid Token');return res.status(500).send({message : 'Internal Server Error'});}
    User.findById(userId , function(err , user){
        if(err){ console.error('Database : '+err); return res.status(500).send({message : 'Internal Server Error'});}
    });
}
