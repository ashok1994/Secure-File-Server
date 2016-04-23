angular.module('app.controllers')
.controller("TabController", ["$scope",  "$timeout", "$mdSidenav", "$log","$mdMedia", "localStorageService", "$rootScope", "$location", "AuthSvc",
	function($scope,  $timeout, $mdSidenav, $log, $mdMedia, localStorageService, $rootScope, $location, AuthSvc){
		// console.log($mdMedia);
	
		if(localStorageService.get("userInfo")){
			// TODO: Check for token;
			console.log("yess");
			$rootScope.isLoggedIn = true;
			// $location.path("/");
		}else{
			console.log("no")
			$rootScope.isLoggedIn = false;
			// $location.path('/');
		}

		console.log($location.path());
		$rootScope.logout = function(){
			AuthSvc.logout()
			.then(function(resp){
				$rootScope.isLoggedIn = false;
				$location.path("/");
			}, function(err){
				$rootScope.isLoggedIn = false;
				localStorageService.remove("userInfo");
				$location.path("/");
			});
		}



		
	}
]);
