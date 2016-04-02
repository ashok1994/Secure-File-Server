<<<<<<< HEAD
angular.module("controllers")
.controller("HomeController", ["$scope","$location","$window",
	function($scope,$location,$window){
=======
angular.module("app.controllers")
.controller("HomeController", ["$scope", 
	function($scope){
>>>>>>> 44016a3adb7aae9464ac1f5f3cfcdf34161046d5
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
