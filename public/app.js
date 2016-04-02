var app = angular.module('secureFileServer', ['ngRoute','controllers'])


app.config(function($routeProvider, $locationProvider){

	$routeProvider

	.when('/', {
		templateUrl : "features/home/views/home.html",
		controller  : "HomeController"
	})

	$locationProvider.html5mode(true);
});



