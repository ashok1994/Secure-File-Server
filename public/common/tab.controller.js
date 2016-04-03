angular.module('app.controllers')
.controller("TabController", ["$scope",  "$timeout", "$mdSidenav", "$log",
	function($scope,  $timeout, $mdSidenav, $log){

		$scope.toggleLeft = function(navId){
			$mdSidenav(navId)
        	  .toggle()
        	  .then(function () {
            	$log.debug("toggle " + navId + " is done");
          	});
		}
	}
]);
