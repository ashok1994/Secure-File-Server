angular.module("controllers")
.controller("HomeController", ["$scope","$location","$window",
	function($scope,$location,$window){
		$scope.msg = "hello anks";
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
		console.log("hello");
	}
]);
