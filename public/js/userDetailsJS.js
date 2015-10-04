var SocialMediaPrototypeUserDetails = angular.module('SocialMediaPrototypeUserDetails',[]);
SocialMediaPrototypeUserDetails.controller('userDetailsController', function($scope,$window) {
	$scope.user = {};
});

SocialMediaPrototypeUserDetails.controller('AboutUserController', ['$scope','$http', function ($scope , $http) {
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