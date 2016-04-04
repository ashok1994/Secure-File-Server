angular.module('app.services')
.factory("AuthSvc", ["$http", "$q", "localStorageService", 
	function($http, $q, localStorageService){

		this.login = function(user){

			var deferred = $q.defer();
			$http({
				method : "POST",
				url    : "/api/login",
				data   : {user : user}
			}).then(function(resp){
				deferred.resolve(resp);
			}, function(err){
				deferred.reject(err);
			});
			return deferred.promise;
		};

		this.setAccessToken = function(access_token){
			var status = localStorageService.set("access_token", access_token);
			return status;
		};


		return (this);
	}
]);