angular.module("controllers")
.controller("HomeController", ["$scope", "localStorageService", "$location", "$window",
	function($scope, localStorageService, $location, $window){
		console.log(localStorageService.set("key", "value"));
		$scope.login = function () {
		        authenticationSvc.login($scope.Email, $scope.password)
		            .then(function (result) {
		              $location.path("/#");
		            }, function (error) {
		                $window.alert("Invalid credentials");
		                console.log(error);
		            });
		    };
	   	$scope.signup = function () {
		        authenticationSvc.signup($scope.Email, $scope.password)
		            .then(function (result) {
		              $location.path("/#");
		              }, function (error) {
		                    $window.alert("error");
		                    $location.path("/#");
		              });
        	};  	
	}
]);
