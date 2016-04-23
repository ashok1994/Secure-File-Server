module.exports = {

	JWT_KEY         : "abcdefghijklmnopqrstuvwxyz",
	DB_URL          : "mongodb://localhost/secureFile",
	PER_USER_QUOTA  : "104857600",
	USER_DATA_FOLDER    : process.env.USER_DATA_FOLDER ||
                            __dirname + '/userdata',

}
