var mongoose = require('mongoose');
var bcrypt    = require('bcrypt-nodejs');



var Auth = {
	
	userId   : String,
	password : String 
};



var userSchema = mongoose.Schema({
	
	name  : String,
	email : String,
	phone : Number,
	auth  : Auth,	
	role  : {type : String ,enum : ['user', 'admin'] } 


});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.auth.password);
};


module.exports = mongoose.model('User', userSchema);
