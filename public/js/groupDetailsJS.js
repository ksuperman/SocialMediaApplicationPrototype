var SocialMediaPrototypeGroupDetailsApp = angular.module('SocialMediaPrototypeGroupDetailsApp', []);
SocialMediaPrototypeGroupDetailsApp.controller('GroupDetailsPageController', function($scope,$http,$window) {
	$scope.user = {};
	$scope.group = {};
	$scope.group.GROUP_NAME ="TEST";
	console.log("Initiallised : " + $scope.group.GROUP_NAME);
	$scope.curUsers = {};
	$scope.newUsers = {};
	
	$scope.logout = function(){
		$http({
			  method: 'POST',
			  url: '/logout',
			  headers: {
				   'Content-Type': 'application/json'
			  }
				}).then(function successCallback(response) {
					$scope.user = {};
					$window.location.assign("/");
					$window.location.reload(true);
				}, function errorCallback(response) {
					alert("There was an Error trying to logout your Session !!!");
			});
	};
	
	$scope.getGroupsInfo = function(){
		$scope.group.error = false;
		$scope.group.errorMsg = "";
		$http({
		  method: 'GET',
		  url: '/getGroupDetails' //,
		 // headers: {
		//	   'Content-Type': 'application/json'
		//  }//,
		  	//data: JSON.stringify($scope.group)
			}).then(function successCallback(response) {
				console.log("Group Details fetched !!! " + JSON.stringify(response.data[0]));
				console.log("before : " + $scope.group.GROUP_NAME);
				$scope.group = response.data[0];
				console.log(JSON.stringify($scope.group));
				console.log($scope.group.GROUP_NAME);
				//$window.location.assign("/");
				//$window.location.reload(true);
			}, function errorCallback(response) {
				$scope.group.error = true;
				$scope.group.errorMessage = "There was an error retriving the Information for this Group.";
				console.log("error in getGroupsInfo " +  JSON.stringify(response));
		});
	};
	
	$scope.getCurrentMembers = function(){
		$scope.curUsers.error = false;
		$scope.curUsers.errorMsg = "";
		$http({
		  method: 'GET',
		  url: '/getGroupUserList' //,
		 // headers: {
		//	   'Content-Type': 'application/json'
		//  }//,
		  	//data: JSON.stringify($scope.group)
			}).then(function successCallback(response) {
				$scope.curUsers = response.data;
				//$window.location.assign("/");
				//$window.location.reload(true);
			}, function errorCallback(response) {
				$scope.curUsers.error = true;
				$scope.curUsers.errorMessage = "There was an error retriving the User in this Group.";
				console.log("error in getCurrentMembers " +  JSON.stringify(response));
		});
	};
	
	$scope.getNonMembers = function(){
		$scope.newUsers.error = false;
		$scope.newUsers.errorMsg = "";
		$http({
		  method: 'GET',
		  url: '/getGroupNonMembers' //,
		 // headers: {
		//	   'Content-Type': 'application/json'
		//  }//,
		  	//data: JSON.stringify($scope.group)
			}).then(function successCallback(response) {
				$scope.newUsers = response.data;
			}, function errorCallback(response) {
				$scope.newUsers.error = true;
				$scope.newUsers.errorMessage = "There was an error retriving the User who are not in this Group.";
				console.log("error in getNonMembers " +  JSON.stringify(response));
		});
	};
	
	$scope.deleteGroup = function(group){
		
	};
	
	$scope.removeUserfromGroup = function(cuser){
		cuser.GROUP_ID = $scope.group.ROW_ID;
		$scope.curUsers.error = false;
		$scope.curUsers.errorMsg = "";
		$http({
		  method: 'POST',
		  url: '/removeUserFromGroupAdmin',
		  headers: {
			   'Content-Type': 'application/json'
		  },
		  	data: JSON.stringify(cuser)
			}).then(function successCallback(response) {
				$scope.getNonMembers();
				$scope.getCurrentMembers();
			}, function errorCallback(response) {
				$scope.curUsers.error = true;
				$scope.curUsers.errorMessage = "There was an error deleting the User from this Group.";
				console.log("error in removeUserfromGroup " +  JSON.stringify(response));
		});
	};
	
	$scope.addUserToGroup = function(nuser){
		nuser.GROUP_ID = $scope.group.ROW_ID;
		$scope.newUsers.error = false;
		$scope.newUsers.errorMsg = "";
		$http({
		  method: 'POST',
		  url: '/addUserToGroupAdmin',
		  headers: {
			   'Content-Type': 'application/json'
		  },
		  	data: JSON.stringify(nuser)
			}).then(function successCallback(response) {
				$scope.getNonMembers();
				$scope.getCurrentMembers();
			}, function errorCallback(response) {
				$scope.newUsers.error = true;
				$scope.newUsers.errorMessage = "There was an error deleting the User from this Group.";
				console.log("error in removeUserfromGroup " +  JSON.stringify(response));
		});
	};
});