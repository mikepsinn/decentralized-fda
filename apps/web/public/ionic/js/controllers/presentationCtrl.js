angular.module('starter').controller('PresentationCtrl', ["$scope", "$state", "$ionicSlideBoxDelegate", "$ionicLoading",
    "$rootScope", "$stateParams", "qmService", "appSettingsResponse", "$timeout",
    function($scope, $state, $ionicSlideBoxDelegate, $ionicLoading,
             $rootScope, $stateParams, qmService, appSettingsResponse, $timeout){
        qmService.initializeApplication(appSettingsResponse);
        qmService.navBar.setFilterBarSearchIcon(false);
        $scope.state = {
			backgroundImageUrl: null,
            hideTriangle: false,
            triangleName: {
                lineOne: "FDA",
                lineTwo: "Ai"
            },
	        slideIndex: 0,
	        start: function(){
		        qm.music.play();
		        $scope.state.next();
	        },
	        next: function(index){
		        $ionicSlideBoxDelegate.next();
	        },
	        previous: function(){
		        $ionicSlideBoxDelegate.previous();
	        },
	        slideChanged: function(index){
				debugger
		        qm.visualizer.showCircleVisualizer()
		        slide = $scope.state.slides[index];
		        $scope.state.hideTriangle = !!slide.img;
				if(slide.animation){
					slide.animation($scope);
				}
				if(slide.backgroundImageUrl){
					$scope.state.backgroundImg = slide.backgroundImageUrl;
				} else {
					$scope.state.backgroundImg = null;
				}
		        $scope.state.slideIndex = index;
		        qm.speech.talkRobot(
			        slide.speech
			        , null // $scope.state.next
			        , function(error){
				        qmLog.info("Could not read intro slide because: " + error);
			        }, false, false
		        );
	        },
	        slides: []
        };
        $scope.$on('$ionicView.beforeEnter', function(e){
            $rootScope.hideNavigationMenu = true;
	        qmService.rootScope.setProperty('speechEnabled', true);
	        $scope.showRobot = true;
	        qm.speech.setSpeechEnabled(true);
	        $scope.state.slides = slides;
        });
        $scope.$on('$ionicView.afterEnter', function(){
            qmService.navBar.hideNavigationMenu();
            qm.robot.onRobotClick = $scope.state.next;
			qmService.hideLoader();
        });
        $scope.$on('$ionicView.beforeLeave', function(){
            qm.music.fadeOut();
            qm.robot.onRobotClick = null;
			qmService.showFullScreenLoader();
        });
    }]);
