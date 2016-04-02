angular.module("controllers")
.controller("HomeController", ["$scope", 
	function($scope){
		$scope.msg = "hello anks";

		console.log("hello");
	}
]);