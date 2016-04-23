angular.module('app.controllers')
.controller("LoginController", ["$scope", "$routeParams", "$window", "AuthSvc", "$rootScope", "$timeout",  
	function($scope, $routeParams, $window, AuthSvc, $rootScope, $timeout){
		$scope.msg = "hello";
		console.log("hello");



		var redirect_uri = window.location.protocol+'//'+window.location.host+'/login';
		console.log(redirect_uri);
		// TODO : change redirect uri


		$scope.googleLogin = function(){
			$scope.verificationRequired  = false;
			var authUrl = 'https://accounts.google.com/o/oauth2/auth?';
			// TODO : Inject as an constant | Client ID
			var uri = 'response_type=code&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/plus.me https://www.google.com/m8/feeds/&client_id=316165121851-r3kib68cf589pcrjiv6jfesi4g3dro7b.apps.googleusercontent.com&redirect_uri='+redirect_uri;
			uri = encodeURI(uri);
			authUrl = authUrl+uri;
			window.location.href = authUrl;
			// console.log(authUrl);
		}
		if($routeParams.code){
			$scope.waiting = true;
			$scope.showData = true;
			console.log("inside code");
			AuthSvc.getGmailId($routeParams.code,redirect_uri)
			.then(function(response){
				console.log(response.data);
				$scope.email = response.data.email;
				$scope.fullName  = response.data.name || "Guest";
				if(!$scope.email){
					alert('Error Occured  ');
					window.location.href = window.location.protocol+'//'+window.location.host+'/login';
				}
				$scope.disableIt = true;
				$scope.waiting   = false;
				if($scope.fullName && $scope.email){

					AuthSvc.signup($scope.fullName,$scope.email,'',false)
					.then(function(res){

			  				$rootScope.loggedInActive = true;
			  				//$location.search('code', null);
			  				//$location.search('authuser', null);
			  				//$location.search('session_state', null);
			  				//$location.search('prompt', null);
			  				// $timeout(function() {
			  				// 	AuthSvc.redirectToReferrer('google');
			  				// }, 10);
			  				window.location.href = window.location.protocol+'//'+window.location.host;
					},function(err){
						console.log(err);
						window.location.href = window.location.origin;
					});

				}else{
					console.log(response);
					window.location.href = window.location.origin;
				}

			},function(err){
				console.log(err);
				window.location.href = window.location.origin;
			});
		}

	}
]);