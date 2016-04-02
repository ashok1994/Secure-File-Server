var app = angular.module('secureFileServer', ['ngRoute','app.controllers'])


app.config(function($routeProvider, $locationProvider){

	$routeProvider

	.when('/', {
		templateUrl : "features/home/views/home.html",
		controller  : "HomeController"
	})

	.otherwise({redirectTo : '/'});
	$locationProvider.html5Mode(true);
});



