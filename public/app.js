var app = angular.module('secureFileServer', 
	[
		'ngRoute', 
		'app.controllers', 
		'app.services', 
		'app.directives',
		'ngMaterial',
		'LocalStorageModule',
		'angularFileUpload',
		'ui.bootstrap'
	]);


app.config(function($routeProvider, $locationProvider, localStorageServiceProvider){

	localStorageServiceProvider.setPrefix("sfs");
	localStorageServiceProvider.setStorageCookie(1, '/');
	localStorageServiceProvider.setNotify(true);
	localStorageServiceProvider.setStorageCookieDomain('');

	$routeProvider
	.when('/', {
		templateUrl : "features/home/views/home.dashboard.html",
		controller  : "DashboardController"
	})
	.when('/:q', {
		templateUrl : "features/home/views/home.dashboard.html",
		controller  : "DashboardController"
	})
	.when('/auth/login', {
		templateUrl : "features/login/views/login.html",
		controller  : "LoginController"
	})
	.when('/view/:vidId', {
		templateUrl : "features/video/views/displayVideo.html",
		controller  : "VideoController"

	})
	.when('/user/profile', {
		templateUrl : "features/video/views/myVideos.html",
		controller  : "MyVideoController"		
	})

	.otherwise({redirectTo : '/'});
	$locationProvider.html5Mode(true);
});



