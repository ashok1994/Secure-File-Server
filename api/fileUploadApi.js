
var fs         = require('fs');
var getSize    = require('get-folder-size');
var User       = require('../dbSchema/User.js');

getSize('../../Secure-File-Server', function(err, size){
	if(err){console.log(err);}
	console.log("Bytes : "+(size/1024/1024).toFixed(2));
});


