var SocialMediaPrototypeFriendDetails = angular.module('SocialMediaPrototypeFriendDetails',[]);
SocialMediaPrototypeFriendDetails.controller('friendDetailsController',function($scope,$http,$window){
	$scope.curuser = {};
	$scope.user = {};
	$scope.friend = {};
	
	
	$scope.GetFriendDetails = function(){
		$http({
			  method: 'POST',
			  url: '/getFriendDetails',
			  headers: {
				   'Content-Type': 'application/json'
			  },
			  data: JSON.stringify($scope.user)
				}).then(function successCallback(response) {
					console.log("Response from Server for GetFriendDetails ++ " + JSON.stringify(response.data));
					$scope.user = response.data[0];
				}, function errorCallback(response) {
					$scope.user.errorMessage = "There was an error retriving your Friends Page!!";
					$scope.user.error = true;
					console.log("Error In My Friends request" + JSON.stringify(response));	
					console.log(" my Friends Details JSON : " + JSON.stringify($scope.user));	
			});
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

SocialMediaPrototypeFriendDetails.controller('AboutFriendController', ['$scope','$http', function ($scope , $http ,$window) {
	$scope.lifeevents = {};
    $scope.tabs = [{
            title: 'Overview',
            url: '/html/overview.html'
        }, {
            title: 'Work and Education',
            url: '/html/workandeducation.html'
        }, {
            title: 'Life Events',
            url: '/html/lifeevents.html'
    }];

    $scope.currentTab = '/html/overview.html';

    $scope.onClickTab = function (tab) {
        $scope.currentTab = tab.url;
    };
    
    $scope.isActiveTab = function(tabUrl) {
        return tabUrl == $scope.currentTab;
    };
    
    $scope.getLifeEvents = function(){
		$scope.lifeevents.errorMessage = "";
		$scope.lifeevents.error = false;
    	$http({
			  method: 'POST',
			  url: '/getLifeEvents',
			  headers: {
				   'Content-Type': 'application/json'
			  },
			  data: JSON.stringify($scope.lifeevents)
				}).then(function successCallback(response) {
					console.log("Response from Server for MyFriends ++ " + JSON.stringify(response));
					$scope.lifeevents = response.data;
				}, function errorCallback(response) {
					$scope.lifeevents.errorMessage = "There was an error retriving your Life Events!!";
					$scope.lifeevents.error = true;
					console.log("Error In My Friends request" + JSON.stringify(response));	
					console.log(" my Friends list JSON : " + JSON.stringify($scope.lifeevents));	
			});
    };
    


}]);