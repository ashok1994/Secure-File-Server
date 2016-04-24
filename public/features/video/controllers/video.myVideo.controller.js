angular.module('app.controllers')
.controller("MyVideoController", ["$scope", "$location", "AuthSvc", "localStorageService", "$rootScope", "$route",   
	function($scope, $location, AuthSvc, localStorageService, $rootScope, $route){
		if(!localStorageService.get("userInfo")){
			$location.path('/');
			return;
		}
		AuthSvc.getMyVideos()
		.then(function(resp){
			$scope.videos = resp.data;
			// console.log(resp);
		}, function(err){
			console.log(err);
		});

		$scope.delete = function(vidId, vidPath, thumbPath){
			AuthSvc.delete(vidId, vidPath, thumbPath)
			.then(function(resp){
				$route.reload();
			}, function(err){
				alert("error occured");
			});
		}
	}
]);