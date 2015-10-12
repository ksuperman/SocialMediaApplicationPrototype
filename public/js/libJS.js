var socialMediaApp = angular.module('SocialMediaPrototype',[]);

socialMediaApp.controller('loginController', function($scope) {
	$scope.user ={};
	$scope.LoginUser = function(){
		if($scope.loginForm.$valid){
			$scope.user.errorInloginForm = false;
			//alert("Loggin in Please wait !!")
		}
	};
});

socialMediaApp.controller('signUpController', function($scope,$http){
		$scope.user = {};
		//$scope.user.IMAGE_URL="/images/profile-photo_default.jpg";

		$scope.submitSignUpForm = function($event){
		try {
			$scope.user.IMAGE_URL="/images/profile-photo_default.jpg";
			$scope.user.errorInForm = false;
			console.log($scope.user.firstname);
			console.log($scope.user.lastName);
			console.log($scope.user.emailM);
			console.log($scope.user.emailR);
			console.log($scope.user.password);
			console.log($scope.user.dateofbirth);
			console.log($scope.user.currentDate);
			console.log($scope.user.gender);
			
			var currentDate = new Date();
			var pastLimitDate = new Date("1900-01-01");
			var dob = new Date($scope.user.dateofbirth);
			
			console.log("gettime : " + dob.getTime() > currentDate.getTime());
			
			if ($scope.user.emailM !== $scope.user.emailR || $scope.user.emailR !== $scope.user.emailM) {
				$scope.user.errorMessage = "The emails entered dosnt Match!!";
				$scope.user.errorInForm = true;
				console.log("Email Error");
				//throw e;
			} else if (dob.getTime() > currentDate.getTime()) {
				$scope.user.errorMessage = "Sorry People born in the Future Cannot Create Account in the Present ;)";
				$scope.user.errorInForm = true;
				$scope.signUpForm.$valid = false;
				//throw e;
			}else if(dob.getTime() < pastLimitDate.getTime()){
				$scope.user.errorMessage = "Are you seriously more than 100 years old!!!";
				$scope.user.errorInForm = true;
				$scope.signUpForm.$valid = false;
				//throw e;
			}else{
				$scope.user.errorMessage = "";
				$scope.user.errorInForm = false;
				$scope.signUpForm.$valid = true;
			}
			$scope.user.IMAGE_URL="/images/profile-photo_default.jpg";
			if ($scope.signUpForm.$valid && !$scope.user.errorInForm) {
				console.log("Request for New Account : " + JSON.stringify($scope.user));
				$('#signUpForm').submit();
				/*$http({
				  method: 'POST',
				  url: '/signup',
				  headers: {
					   'Content-Type': 'application/json'
				  },
				  data: JSON.stringify($scope.user)
					}).then(function successCallback(response) {
						$scope.user = {};
					}, function errorCallback(response) {
						if(response.data.code === "ER_DUP_ENTRY"){
							$scope.errorMessage = "Error creating your Account!! This email is already registered..";
						}
						else{
							$scope.errorMessage = "Error creating your Account!! Please try Again..";
						}
						$scope.user.errorInForm = true;
				});*/
			}
		} catch (e) {
			alert(e);
		}	
	};
});



/*
socialMediaApp.directive('watchChange', function() {
    return {
        scope: {
            onchange: '&watchChange'
        },
        link: function(scope, element, attrs) {
            element.on('input', function() {
                scope.$apply(function () {
                    scope.onchange();
                });
            });
        }
    };
});*/