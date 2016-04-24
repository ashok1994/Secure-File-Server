angular.module('app.services')
.factory("AuthSvc", ["$http", "$q", "localStorageService", 
	function($http, $q, localStorageService){

		this.login = function(user){

			var deferred = $q.defer();
			$http({
				method : "POST",
				url    : "/api/login",
				data   : {user : user}
			}).then(function(resp){
				deferred.resolve(resp);
			}, function(err){
				deferred.reject(err);
			});
			return deferred.promise;
		};

		this.setAccessToken = function(access_token){
			var status = localStorageService.set("access_token", access_token);
			return status;
		};

		this.logout = function(){
			var userInfo = localStorageService.get("userInfo") || false;
			if(userInfo){
				var deferred = $q.defer();
				localStorageService.remove("userInfo");
				// TODO: Remove access_token in backend
				$http({
					method : "POST",
					url    : "/api/logout",
					headers: {access_token: userInfo.accessToken}
				}).then(function(resp){
					deferred.resolve(resp);
				}, function(err){
					deferred.reject(err);
				});
				return deferred.promise;
			}
		}

		this.setReferrer = function(path){
      		localStorageService.set('referrer', path);
  		}


  		this.getGmailId = function(code,redirect_uri){
		    var deferred = $q.defer();
		    $http({
		      method : "POST",
		      url    : "/api/getGmailId",
		      data   : {'code' : code,'redirect_uri':redirect_uri}
		    }).then(function(response){
		      deferred.resolve(response);
		    },function(err){
		      deferred.reject(err);
		    })
		    return deferred.promise;
		}


		this.signup = function(userName,userEmail, password, verificationRequired) {
	        var deferred = $q.defer();
	        var role = 'user';
	        var userInfoData;

	        $http({
	          url    : "/api/signup",
	          method : "POST",
	          data : {
	             userName             : userName,
	             userEmail            : userEmail,
	             password             : password,
	             verificationRequired : verificationRequired,
	             role: role
	          }
	        })
	            .then(function (result) {
	            //   console.log(result.data);
	              // userInfoData = getbillingAdds(result.data);
	              // 
	              // 
	              var userInfoData = {};
	              userInfoData.accessToken = result.data.access_token;
	              userInfoData.name        = result.data.user.name;
	              userInfoData.email       = result.data.user.email;
	              userInfoData.userId      = result.data.user._id.toString();
	              
	              localStorageService.set('userInfo', userInfoData);
	              
	              console.log(result);
	              // alert("hell");
	              setTimeout(function(){
	                deferred.resolve(result);
	              },10);
	            },
	            function (error) {
	                deferred.reject(error);
	            });


	            return deferred.promise;
	    }



		this.redirectToReferrer = function redirectToReferrer(source){
	      var pathname = "";
	      if(localStorageService.get('referrer')){
	          pathname = localStorageService.get('referrer');
	      }else{
	          pathname = '/';
	      }

	      localStorageService.remove('referrer');
	      if(source){
	          	window.location.href = window.location.protocol+'//'+window.location.host+pathname;
	      	}else{
	        	$location.path(pathname);
	    	}
	  	}


	  	this.postFile = function(file,$upload,name){
			var deferred = $q.defer();
			var access_token = (localStorageService.get("userInfo")).accessToken;
			var url = "/api/postFile";
			$upload.upload({
				url       : url,
				method    : 'POST',
				file      : file,
				headers   : {'access_token' : access_token, 'name' : name}
			})
			.then(function(res){
				console.log(res);
				deferred.resolve(res);
			},function(err){
				deferred.reject(err);
			})
			return deferred.promise;
		}

		this.getVideos = function(){
			var deferred = $q.defer();
			var headers = {};
			if(localStorageService.get("userInfo")){
				var access_token = (localStorageService.get("userInfo")).accessToken;
				headers = {access_token: access_token};
			}
			
			
			$http({
				url    :"/api/getVideos",
				method : "POST",
				headers: headers
			}).then(function(resp){
				console.log(resp);
				deferred.resolve(resp);
			}, function(err){
				deferred.reject(err);
			});
			return deferred.promise;
		}

		this.searchVideo = function(query){
			var deferred = $q.defer();
			$http({
				url     : "/api/searchVideo",
				method  : "POST",
				data    : {key: query}
			}).then(function(resp){
				deferred.resolve(resp);
			}, function(err){
				deferred.reject(err);
			});
			return deferred.promise;
		}
		
		this.getlatestVideos = function(){
			var deferred = $q.defer();
			$http({
				url    : "/api/getlatestVideos",
				method : "POST"
			}).then(function(resp){
				deferred.resolve(resp);
			}, function(err){
				deferred.reject(err);
			});
			return deferred.promise;
		}

		this.getVideoDetails = function(vidId){
			var deferred = $q.defer();
			$http({
				url    : "/api/getVideoDetails",
				method : "POST",
				data   : {vidId : vidId}
			}).then(function(resp){
				deferred.resolve(resp);
			}, function(err){
				deferred.reject(err);
			});
			return deferred.promise;	
		}

		this.postLike = function(vidId){
			var deferred = $q.defer();
			$http({
				url    : "/api/postLike",
				method : "POST",
				data   : {vidId : vidId},
				headers : {access_token : (localStorageService.get("userInfo")).accessToken}
			}).then(function(resp){
				deferred.resolve(resp);
			}, function(err){
				deferred.reject(err);
			});
			return deferred.promise;	
		}

		this.postComment = function(vidId, comments){
			var deferred = $q.defer();
			$http({
				url    : "/api/postComment",
				method : "POST",
				data   : {vidId : vidId, comments: comments},
				headers : {access_token : (localStorageService.get("userInfo")).accessToken}
			}).then(function(resp){
				deferred.resolve(resp);
			}, function(err){
				deferred.reject(err);
			});
			return deferred.promise;	
		}

		this.getMyVideos = function(){
			var deferred = $q.defer();
			$http({
				url    : "/api/getMyVideos",
				method : "POST",
			
				headers : {access_token : (localStorageService.get("userInfo")).accessToken}
			}).then(function(resp){
				deferred.resolve(resp);
			}, function(err){
				deferred.reject(err);
			});
			return deferred.promise;
		}

		this.delete = function(vidId, vidPath, thumbPath){
			var deferred = $q.defer();
			$http({
				url    : "/api/delete",
				method : "POST",
				data   : {vidId: vidId, vidPath: vidPath, thumbPath: thumbPath},
				headers : {access_token : (localStorageService.get("userInfo")).accessToken}
			}).then(function(resp){
				deferred.resolve(resp);
			}, function(err){
				deferred.reject(err);
			});
			return deferred.promise;
		}

		return (this);
	}
]);