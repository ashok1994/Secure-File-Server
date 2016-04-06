angular.module("app.controllers")
.controller("HomeController", ["$scope", "localStorageService", "$location", "$window", "AuthSvc", "$rootScope",
	function($scope, localStorageService, $location, $window, AuthSvc, $rootScope){
		// console.log(localStorageService.set("key", "value"));
		
		$scope.user = {};
		$scope.errorMsg = "";
		if(localStorageService.get('access_token') && $rootScope.isLoggedIn){
			console.log(localStorageService.get('access_token'));
			$location.path('/dashboard');
		}
		$scope.login = function () {
			console.log("tkdgfhh");
			if(!$scope.user.id || !$scope.user.password){
				$scope.errorMsg = "Please enter user id and password";
				return;
			}

			$scope.errorMsg = "";
	    	AuthSvc.login($scope.user)
	    	.then(function(resp){
	    		if(resp.data.accessToken){
	    			console.log(resp.data.accessToken);
	    			if(AuthSvc.setAccessToken(resp.data.accessToken)){
	    				$rootScope.isLoggedIn = true;
	    				$location.path('/dashboard');
	    			}else{
	    				$rootScope.isLoggedIn = false;
	    			}
	    			console.log($rootScope.isLoggedIn);
	    		}else{
	    			alert("Unknown error");
	    		}
	    	}, function(err){
	    		$scope.errorMsg = err.data.message;
	    		console.log(err.data.message);
	    	});    
		};
	   	$scope.signup = function () {

        };  	
	}
]);
