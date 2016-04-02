var app = angular.module('secureFileServer', 
	[
		'ngRoute', 
		'app.controllers', 
		'app.services', 
		'app.directives',
		'ngMaterial',
		'LocalStorageModule'
	]);


app.config(function($routeProvider, $locationProvider, localStorageServiceProvider){

	localStorageServiceProvider.setPrefix("sfs");
	localStorageServiceProvider.setStorageCookie(1, '/');
	localStorageServiceProvider.setNotify(true);
	localStorageServiceProvider.setStorageCookieDomain('');

	$routeProvider
	.when('/', {
		templateUrl : "features/home/views/home.html",
		controller  : "HomeController"
	})

	.otherwise({redirectTo : '/'});
	$locationProvider.html5Mode(true);
});



