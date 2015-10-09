var SocialMediaPrototypeFriendList = angular.module('SocialMediaPrototypeFriendList', []);
SocialMediaPrototypeFriendList.controller('friendListController', function($scope,$http) {
	$scope.user = {};
	$scope.myfriendslist = {};
	$scope.friendslist = {};
	$scope.friendrequest = {};
	$scope.temp = {};
	$scope.tempfriends = {};
	$scope.Pendingfriendslist = {};
	
	$scope.listMyFriends = function(){
		$scope.myfriendslist.errorMessage = "";
		$scope.myfriendslist.error = false;;
		$http({
			  method: 'POST',
			  url: '/loadMyFriendList',
			  headers: {
				   'Content-Type': 'application/json'
			  },
			  data: JSON.stringify($scope.myfriendslist)
				}).then(function successCallback(response) {
					console.log("Response from Server for MyFriends ++ " + JSON.stringify(response));
					$scope.myfriendslist = response.data;
				}, function errorCallback(response) {
					$scope.myfriendslist.errorMessage = "There was an error retriving your Friends!!";
					$scope.myfriendslist.error = true;
					console.log("Error In My Friends request" + JSON.stringify(response));	
					console.log(" my Friends list JSON : " + JSON.stringify($scope.myfriendslist));	
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
	
	$scope.loadPendingFriends = function(){
		$http({
			  method: 'POST',
			  url: '/loadPendingFriendList',
			  headers: {
				   'Content-Type': 'application/json'
			  },
			  data: JSON.stringify($scope.Pendingfriendslist)
				}).then(function successCallback(response) {
					console.log("Response from Server for Friends ++ " + JSON.stringify(response));
					$scope.Pendingfriendslist = response.data;
				}, function errorCallback(response) {
					$scope.Pendingfriendslist.errorMessage = "There was an error retriving your Pending Friend Requests!!";
					$scope.Pendingfriendslist.error = true;
					console.log("Error In Friends request" + JSON.stringify(response));	
					console.log("Friends list JSON : " + JSON.stringify($scope.Pendingfriendslist));	
			});
	};
	
	$scope.AcceptFriendRequest = function(friends){
		console.log("AcceptFiendRequest" + friends.FIRST_NAME);
		$http({
			  method: 'POST',
			  url: '/acceptFriendRequest',
			  headers: {
				   'Content-Type': 'application/json'
			  },
			  data: JSON.stringify(friends)
				}).then(function successCallback(response) {
					console.log("Response from Server for Friends ++ " + JSON.stringify(response));
					$scope.listMyFriends();
					$scope.loadPendingFriends();
					//$scope.Pendingfriendslist = response.data;
				}, function errorCallback(response) {
					$scope.Pendingfriendslist.errorMessage = "There was an error Accepting this Friend Request!!";
					$scope.Pendingfriendslist.error = true;
					console.log("Error In Friends request" + JSON.stringify(response));	
					console.log("Friends list JSON : " + JSON.stringify($scope.Pendingfriendslist));	
			});
	};
	
	$scope.RejectFriendRequest = function(friends){
		console.log("RejectFriendRequest" + friends.ROW_ID);
		$http({
			  method: 'POST',
			  url: '/rejectFriendRequest',
			  headers: {
				   'Content-Type': 'application/json'
			  },
			  data: JSON.stringify(friends)
				}).then(function successCallback(response) {
					console.log("Response from Server for Friends ++ " + JSON.stringify(response));
					//$scope.Pendingfriendslist = response.data;
					$scope.loadPendingFriends();
				}, function errorCallback(response) {
					$scope.Pendingfriendslist.errorMessage = "There was an error Rejecting this Friend Request!!";
					$scope.Pendingfriendslist.error = true;
					console.log("Error In Friends request" + JSON.stringify(response));	
					console.log("Friends list JSON : " + JSON.stringify($scope.Pendingfriendslist));	
			});
	};
	
	$scope.unFriendUserRequest = function(friends){
		console.log("unFriendUserRequest" + friends.ROW_ID);
		$http({
			  method: 'POST',
			  url: '/unFriendUserRequest',
			  headers: {
				   'Content-Type': 'application/json'
			  },
			  data: JSON.stringify(friends)
				}).then(function successCallback(response) {
					console.log("Response from Server for Friends ++ " + JSON.stringify(response));
					$scope.loadFriendList();
					$scope.listMyFriends();
					$scope.loadPendingFriends();
				}, function errorCallback(response) {
					$scope.Pendingfriendslist.errorMessage = "There was an error Rejecting this Friend Request!!";
					$scope.Pendingfriendslist.error = true;
					console.log("Error In Friends request" + JSON.stringify(response));	
					console.log("Friends list JSON : " + JSON.stringify($scope.Pendingfriendslist));	
			});
	};
	
	
});

