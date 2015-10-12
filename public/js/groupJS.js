var SocialMediaPrototypeGroup = angular.module('SocialMediaPrototypeGroup', []);
SocialMediaPrototypeGroup.controller('GroupPageController', function($scope,$http,$window) {
	$scope.user = {};
	$scope.allgroups = {};
	$scope.mygroups = {};
	$scope.group = {};
	$scope.group.IMAGE_URL = "/images/group_thumbnail.jpg";
	
	$scope.loadAllGroups = function(){
		$scope.allgroups.errorMessage = "";
		$scope.allgroups.error = false;;
		$http({
			  method: 'POST',
			  url: '/loadAllGroups',
			  headers: {
				   'Content-Type': 'application/json'
			  },
			  data: JSON.stringify($scope.allgroups)
				}).then(function successCallback(response) {
					console.log("Response from Server for MyFriends ++ " + JSON.stringify(response));
					$scope.allgroups = response.data;
				}, function errorCallback(response) {
					$scope.allgroups.errorMessage = "There was an error retriving the Groups!!";
					$scope.allgroups.error = true;
					console.log("Error In My Friends request" + JSON.stringify(response));	
					console.log(" my GROUPS list JSON : " + JSON.stringify($scope.allgroups));	
			});
	};
	
	$scope.loadMyGroups = function(){
		$scope.mygroups.errorMessage = "";
		$scope.mygroups.error = false;;
		$http({
			  method: 'POST',
			  url: '/loadMyGroups',
			  headers: {
				   'Content-Type': 'application/json'
			  },
			  data: JSON.stringify($scope.mygroups)
				}).then(function successCallback(response) {
					console.log("Response from Server for MyFriends ++ " + JSON.stringify(response));
					$scope.mygroups = response.data;
				}, function errorCallback(response) {
					$scope.mygroups.errorMessage = "There was an error retriving Your Groups!!";
					$scope.mygroups.error = true;
					console.log("Error In My Friends request" + JSON.stringify(response));	
					console.log(" your GROUPS list JSON : " + JSON.stringify($scope.mygroups));	
			});
	};
	
	$scope.addUserToGroup = function(group){
		$scope.allgroups.errorMessage = "";
		$scope.allgroups.error = false;;
		$http({
			  method: 'POST',
			  url: '/addUserToGroup',
			  headers: {
				   'Content-Type': 'application/json'
			  },
			  data: JSON.stringify(group)
				}).then(function successCallback(response) {
					console.log("Response from Server for MyFriends ++ " + JSON.stringify(response));
					$scope.loadMyGroups();
					$scope.loadAllGroups();
				}, function errorCallback(response) {
					$scope.allgroups.errorMessage = "There was an error retriving the Groups!!";
					$scope.allgroups.error = true;
					console.log("Error In My Friends request" + JSON.stringify(response));	
					console.log(" my GROUPS list JSON : " + JSON.stringify($scope.allgroups));	
			});
	};
	
	$scope.removeUserFromGroup = function(group){
		$scope.mygroups.errorMessage = "";
		$scope.mygroups.error = false;;
		$http({
			  method: 'POST',
			  url: '/removeUserFromGroup',
			  headers: {
				   'Content-Type': 'application/json'
			  },
			  data: JSON.stringify(group)
				}).then(function successCallback(response) {
					console.log("Response from Server for MyFriends ++ " + JSON.stringify(response));
					$scope.loadMyGroups();
					$scope.loadAllGroups();
					//$scope.mygroups = response.data;
				}, function errorCallback(response) {
					$scope.mygroups.errorMessage = "There was an error retriving Your Groups!!";
					$scope.mygroups.error = true;
					console.log("Error In My Friends request" + JSON.stringify(response));	
					console.log(" your GROUPS list JSON : " + JSON.stringify($scope.mygroups));	
			});	
	};
	
	$scope.createGroup = function(){
		console.log("Clickcreate Grup " + JSON.stringify($scope.group))
		$scope.group.errorMessage = "";
		$scope.group.error = false;;
		$http({
			  method: 'POST',
			  url: '/createGroup',
			  headers: {
				   'Content-Type': 'application/json'
			  },
			  data: JSON.stringify($scope.group)
				}).then(function successCallback(response) {
					console.log("Response from Server for MyFriends ++ " + JSON.stringify(response));
					$scope.loadMyGroups();
					$scope.loadAllGroups();
					$scope.group = {};
					$scope.group.IMAGE_URL = "/images/group_thumbnail.jpg";
					$scope.loadMyGroups();
					$scope.loadAllGroups();
					//$scope.group = response.data;
				}, function errorCallback(response) {
					$scope.group.errorMessage = "There was an error Creating Your Group!!";
					$scope.group.error = true;
					console.log("Error In My Friends request" + JSON.stringify(response));	
					console.log(" your GROUPS list JSON : " + JSON.stringify($scope.group));	
			});	
	};
	
	$scope.navToGroupDetailPage = function(group){
		var groupform = "#navToGroupDetailPage"+group.ROW_ID;
		console.log("groupform : " + groupform);
		$(groupform).submit();
		/*$http({
			  method: 'GET',
			  url: '/navToGroupDetailPage?groupid='+group.ROW_ID//,
			 // headers: {
			//	   'Content-Type': 'application/json'
			//  }//,
			  //data: JSON.stringify($scope.group)
				}).then(function errorCallback(response) {
					$scope.group.errorMessage = "There was an error Navigating to Your Group!!"+ JSON.stringify(response);
					$scope.group.error = true;
					console.log("Error In My Friends request" + JSON.stringify(response));	
					console.log(" your GROUPS list JSON : " + JSON.stringify($scope.group));	
			});	*/
	};
	
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
});