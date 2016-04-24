angular.module('app.controllers')
.controller("DashboardController", ["$scope", "$rootScope", "localStorageService", "$route", "$upload", "$route", "AuthSvc", "$location", "$routeParams", 
	function($scope, $rootScope, localStorageService, $route, $upload, $route, AuthSvc, $location, $routeParams){
	

		// if(!$rootScope.isLoggedIn){
		// 	var access_token = localStorageService.get("access_token");
		// 	// console.log(access_token);
		// 	if(access_token){
		// 		$rootScope.isLoggedIn = true;
		// 		$route.reload();
		// 	}else{
		// 		$location.path('/');
		// 	}
		// }
		 
		if($routeParams.q){
			AuthSvc.searchVideo($routeParams.q)
			.then(function(resp){
				$scope.videos = resp.data;
				console.log(resp);
			}, function(err){
				console.log(err);
			});
		}else{

			AuthSvc.getVideos()
			.then(function(resp){
				$scope.videos = resp.data;
				console.log(resp);
			}, function(err){
				console.log(err);
			});
		}


		$scope.showVid = function(vId){
			$location.path("/view/"+vId);
		}

		$rootScope.searchVideo = function(q){
			console.log(q);
			if(q && q.length)
				$location.path('/'+q);
			else
				return;
		}

		$scope.file = {};
		$scope.fileObject = undefined;
		$scope.getfileobj = function($file){
			
			$scope.fileObject = $file[0];
			console.log($scope.fileObject);
		}

		$scope.toggleFileFeild = function(){
			if(!$rootScope.isLoggedIn){
				alert("Please login to upload videos");
				return;
			}
			$scope.showFileUpload = !$scope.showFileUpload;
		}


		$scope.upload = function(){
			if($scope.fileObject != undefined){
				$scope.wait = true;
				alert($scope.file.name);
				AuthSvc.postFile($scope.fileObject, $upload, $scope.file.name||'unnamed')
				.then(function(res){
					$scope.wait = false;
					$route.reload();
					alert('File uploaded.');
				},function(err){
					if(err.status == -1){
						alert('Invalid file format');
					}else{
						alert('Could not complete action. Unknown error!');
					}
					$scope.wait = false;
					//console.log(err);
				});
			}else{
				alert('Please select a file.');
			}
		}
		$scope.gotoProfile = function(){
			$location.path('/user/profile');
			return;
		}
	}
]);