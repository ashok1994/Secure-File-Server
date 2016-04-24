module.exports = {

	JWT_KEY         : "abcdefghijklmnopqrstuvwxyz",
	DB_URL          : "mongodb://127.0.0.1/secureFile",
	PER_USER_QUOTA  : "104857600",
	USER_DATA_FOLDER    : process.env.USER_DATA_FOLDER ||
                            __dirname + '/userdata',

}
