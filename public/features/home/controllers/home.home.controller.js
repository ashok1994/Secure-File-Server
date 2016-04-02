angular.module("app.controllers")
.controller("HomeController", ["$scope", "localStorageService",
	function($scope, localStorageService){
		$scope.msg = "hello anks";

		console.log(localStorageService.set("key", "value"));

		console.log("hello");
	}
]);
