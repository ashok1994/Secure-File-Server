angular.module('app.controllers')
.controller("TabController", ["$scope",  "$timeout", "$mdSidenav", "$log","$mdMedia",
	function($scope,  $timeout, $mdSidenav, $log, $mdMedia){
		// console.log($mdMedia);
		$scope.toggleLeft = function(navId){
			$mdSidenav(navId)
        	  .toggle()
        	  .then(function () {
            	$log.debug("toggle " + navId + " is done");
          	});
		}

		$scope.mediaVal = function(val){
			console.log($mdMedia(val));
			return $mdMedia(val);
		}
	}
]);
