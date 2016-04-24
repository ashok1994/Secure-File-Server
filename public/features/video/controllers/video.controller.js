angular.module("app.controllers")
.controller("VideoController", ["$scope", "$routeParams", "$sce", "AuthSvc", "$location", "localStorageService", "$rootScope",  
	function($scope, $routeParams, $sce, AuthSvc, $location, localStorageService, $rootScope){
		console.log($routeParams.vidId);
		$scope.vidId = $routeParams.vidId;

		$scope.getUrl = function(){
			var url = "/api/stream/"+$scope.vidId;
			// console.log(url);
			return $sce.trustAsResourceUrl(url);
		}

		AuthSvc.getlatestVideos()
		.then(function(resp){
			$scope.latestVideos = resp.data;
			console.log($scope.latestVideos)
		}, function(err){
			console.log(err);
		});

		AuthSvc.getVideoDetails($scope.vidId)
		.then(function(resp){
			$scope.video = resp.data;
			console.log($scope.video)
			// 
			// 
			$scope.getLikedStatus = function(){
				$scope.liked=false;
				if(!$rootScope.isLoggedIn){
					return false;
				}
				// console.log($scope.video.likes, (localStorageService.get("userInfo")).userId);
				if($scope.video.likes.indexOf((localStorageService.get("userInfo")).userId) == -1){
					// console.log("no");
					return false;
				}else{
					// console.log("yes");
					$scope.liked=true;
					return true;
				}
			}
		}, function(err){
			console.log(err);
		});
		$scope.playThis = function(vidId){
			$location.path('/view/'+vidId);
			return;
		}


		$scope.postLike = function(){
			if(!$rootScope.isLoggedIn){
				alert("Plaese login");
				return;
			}
			// console.log("postLike");
			AuthSvc.postLike($scope.vidId)
			.then(function(resp){
				// console.log(resp);
				// TODO: push userId in likes
				if($scope.liked){
					$scope.video.likes.splice($scope.video.likes.indexOf((localStorageService.get("userInfo")).userId, 1))
				}else{
					$scope.video.likes.push((localStorageService.get("userInfo")).userId);
				}
			}, function(err){
				console.log(err);
			});
		}

		$scope.postComment = function(data){
			if(!$rootScope.isLoggedIn){
				alert("Plaese login");
				return;
			}

			var comments = {};
			if(!data){return;}
			if(!(localStorageService.get("userInfo")).name || !(localStorageService.get("userInfo")).userId){
				alert("Something went wrong :(");return;
			}
			comments.data        = data;
			comments.name        = (localStorageService.get("userInfo")).name;
			comments.commentedBy = (localStorageService.get("userInfo")).userId;
			AuthSvc.postComment($scope.vidId, comments)
			.then(function(resp){
				$scope.commentData = "";
				// TODO: push this comment in comments
				$scope.video.comments.push(comments);
				console.log("comment posted");
			}, function(err){
				console.log(err);
			});
		}
	}
]);