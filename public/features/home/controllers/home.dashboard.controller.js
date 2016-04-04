angular.module('app.controllers')
.controller("DashboardController", ["$scope", "$rootScope", "localStorageService", "$route", 
	function($scope, $rootScope, localStorageService, $route){

		if(!$rootScope.isLoggedIn){
			var access_token = localStorageService.get("access_token");
			// console.log(access_token);
			if(access_token){
				$rootScope.isLoggedIn = true;
				$route.reload();
			}else{
				$location.path('/');
			}
		}
		
		$scope.msg = "hello";
	}
]);