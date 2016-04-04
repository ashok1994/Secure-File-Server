var User     = require('../dbschema/User.js');
var tokenApi = require('./tokenApi.js');
exports.addUser = function( req , res){
    var userId = tokenApi.getUserIdFromToken(req.headers.access_token);
    if(!userId) { console.error('addUser Error Invalid Token');return res.status(500).send({message : 'Internal Server Error'});}
    User.findById(userId , function(err , user){
        if(err){ console.error('Database : '+err); return res.status(500).send({message : 'Internal Server Error'});}
        if(!user){ console.error('User not found '); return res.status(401).send({message : 'User not found'});}
        if(user.role !== 'admin' ) { console.error('Not an admin '); return res.status(401).send({message : 'Unauthorized Request'});}
        if(!req.body.userId || !req.body.password || !req.body.name){ console.error('Less Arguments');return res.status(401).send({message : 'Unauthorized Request'}); }

        var newUser = new User();
        newUser.name          = req.body.name   || '';
        newUser.email         = req.body.email  || '';
        newUser.auth.userId   = req.body.userId ;
        newUser.auth.password = newUser.generateHash(req.body.password);
        newUser.role          = 'user';
        newUser.save(function(err ,  freshUser){
            if(err) { console.error('Database err'+ err); return res.status(500).send({message : 'Internal Server Error'});}
            return { console.info('User created '); return res.status(200).send({message : 'User created'});}
        });

    });
}
