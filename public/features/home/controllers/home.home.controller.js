angular.module("controllers")
.controller("HomeController", ["$scope", "localStorageService", "$location", "$window",
	function($scope, localStorageService, $location, $window){
		console.log(localStorageService.set("key", "value"));
		$scope.login = function () {
	        
		};
	   	$scope.signup = function () {
	  
        };  	
	}
]);
