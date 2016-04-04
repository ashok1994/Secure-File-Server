angular.module('app.controllers')
.controller("TabController", ["$scope",  "$timeout", "$mdSidenav", "$log","$mdMedia", "localStorageService", "$rootScope", "$location", "AuthSvc",
	function($scope,  $timeout, $mdSidenav, $log, $mdMedia, localStorageService, $rootScope, $location, AuthSvc){
		// console.log($mdMedia);
		$scope.toggleLeft = function(navId){
			$mdSidenav(navId)
        	  .toggle()
        	  .then(function () {
            	$log.debug("toggle " + navId + " is done");
          	});
		}
		if(localStorageService.get("access_token") && localStorageService.get("access_token").length>10){
			// TODO: Check for token;
			$rootScope.isLoggedIn = true;
			$location.path("/dashboard");
		}else{
			$rootScope.isLoggedIn = false;
			$location.path('/');
		}


		$scope.logout = function(){
			AuthSvc.logout()
			.then(function(resp){
				$rootScope.isLoggedIn = false;
				$location.path("/");
			}, function(err){
				$rootScope.isLoggedIn = false;
				localStorageService.remove("access_token");
				$location.path("/");
			});
		}

		$scope.mediaVal = function(val){
			// console.log($mdMedia(val));
			return $mdMedia(val);
		}
	}
]);
