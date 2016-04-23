angular.module("app.controllers")
.controller("VideoController", ["$scope", "$routeParams", "$sce",
	function($scope, $routeParams, $sce){
		console.log($routeParams.vidId);
		$scope.vidId = $routeParams.vidId;

		$scope.getUrl = function(){
			var url = "/api/stream/"+$scope.vidId;
			console.log(url);
			return $sce.trustAsResourceUrl(url);
		}
	}
]);