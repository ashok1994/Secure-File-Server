angular.module('app.services')
.factory("AuthSvc", ["$http", "$q", 
	function($http, $q){

		function login(userId, password){
			if(userId && password){
				var deferred = $q.defer();
				$http({
					method : "POST",
					url    : "/api/login",
					data   : {userId: userId, password: password}
				}).then(function(resp){
					deferred.resolve(resp);
				}, function(err){
					deferred.reject(err);
				});
			}else{
				return;
			}
		}


		return this;
	}
]);