var SocialMediaPrototypeHome = angular.module('SocialMediaPrototypeHome', []);
SocialMediaPrototypeHome.controller('homePageController', function($scope,$http) {
	 $scope.user = {};
	// $scope.user.IMAGE_URL = "https://lh3.googleusercontent.com/-uoFDBGmaJME/AAAAAAAAAAI/AAAAAAAAAAA/QcZsAAou26Q/photo.jpg";
	 $scope.newsfeeds = {};
	 $scope.statusupdate = {};
	 $scope.friendslist = {};
	 $scope.statusupdate.IMAGE_URL = "https://lh3.googleusercontent.com/-uoFDBGmaJME/AAAAAAAAAAI/AAAAAAAAAAA/QcZsAAou26Q/photo.jpg";
	 $scope.friendrequest = {};
	 
	console.log($scope.user);
	console.log($scope.newsfeeds);	
	  
	$scope.loadNewsFeeds = function(){
		console.log("Call news Feeds");
		$http({
			  method: 'POST',
			  url: '/getNewsFeeds',
			  headers: {
				   'Content-Type': 'application/json'
			  },
			  data: JSON.stringify($scope.user)
				}).then(function successCallback(response) {
					$scope.newsfeeds = response.data;
					console.log("Response from Server ++ " + JSON.stringify($scope.newsfeeds));	
				}, function errorCallback(response) {
					$scope.newsfeeds.errorMessage = "There was an error retrieving the news Feed";
					$scope.newsfeeds.error = true;
					console.log("Error In request" + JSON.stringify(response));	
					console.log(JSON.stringify($scope.newsfeeds));	
			});
	};
	
	$scope.postStatusUpdate = function(){
		$scope.statusupdate.IMAGE_URL = "https://lh3.googleusercontent.com/-uoFDBGmaJME/AAAAAAAAAAI/AAAAAAAAAAA/QcZsAAou26Q/photo.jpg";
		$scope.statusupdate.errorMessage = "";
		$scope.statusupdate.error = false;
		$http({
			  method: 'POST',
			  url: '/postStatusUpdate',
			  headers: {
				   'Content-Type': 'application/json'
			  },
			  data: JSON.stringify($scope.statusupdate)
				}).then(function successCallback(response) {
					console.log("Response from Server ++ " + JSON.stringify(response));	
					$scope.loadNewsFeeds();
					$scope.statusupdate = {};
				}, function errorCallback(response) {
					$scope.statusupdate.errorMessage = "There was an error posting your status Update!!";
					$scope.statusupdate.error = true;
					console.log("Error In request" + JSON.stringify(response));	
					console.log(JSON.stringify($scope.newsfeeds));	
			});
	};
	
	$scope.loadFriendList = function(){
		$http({
			  method: 'POST',
			  url: '/loadFriendList',
			  headers: {
				   'Content-Type': 'application/json'
			  },
			  data: JSON.stringify($scope.friendslist)
				}).then(function successCallback(response) {
					console.log("Response from Server for Friends ++ " + JSON.stringify(response));
					$scope.friendslist = response.data;
				}, function errorCallback(response) {
					$scope.friendslist.errorMessage = "There was an error retriving your Friends Suggestions!!";
					$scope.friendslist.error = true;
					console.log("Error In Friends request" + JSON.stringify(response));	
					console.log("Friends list JSON : " + JSON.stringify($scope.friendslist));	
			});
	};
	
	$scope.sendFiendRequest = function(friendId){
		$scope.friendrequest.friendId = friendId.ROW_ID;
		$http({
			  method: 'POST',
			  url: '/sendFiendRequest',
			  headers: {
				   'Content-Type': 'application/json'
			  },
			  data: JSON.stringify($scope.friendrequest)
				}).then(function successCallback(response) {
					console.log("Response from Server for Friends ++ " + JSON.stringify(response));
					$scope.friendrequest = {};
					$scope.friendrequest.sucess = true;
					$scope.loadFriendList();
				}, function errorCallback(response) {
					$scope.friendrequest.errorMessage = "There was an error sending your friend request Please Try Again!!";
					$scope.friendrequest.error = true;
					console.log("Error In friendrequest " + JSON.stringify(response));	
					console.log("Friends list JSON : " + JSON.stringify($scope.friendrequest));	
			});
	};
});
