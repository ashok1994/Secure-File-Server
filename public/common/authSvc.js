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

		this.logout = function(){
			var access_token = localStorageService.get("access_token") || false;
			if(access_token){
				var deferred = $q.defer();
				localStorageService.remove("access_token");
				// TODO: Remove access_token in backend
				$http({
					method : "POST",
					url    : "/api/logout",
					headers: {access_token: access_token}
				}).then(function(resp){
					deferred.resolve(resp);
				}, function(err){
					deferred.reject(err);
				});
				return deferred.promise;
			}
		}

		return (this);
	}
]);