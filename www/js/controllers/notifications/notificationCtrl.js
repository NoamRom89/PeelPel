'use strict';
/**
  * controller  - filter
*/
app.controller('NotificationCtrl', function($scope, $rootScope, $http, APP_REGEX, $localstorage, $state,$ionicLoading, $ionicPopup){
	//console.log('I am a notificationCtrl');

  var lsValue =  $localstorage.get($localstorage.localSTypes.BNSToken);
  $http.defaults.headers.post['x-access-token'] = lsValue;

  $scope.notifications = {};

  var cleanUpFuncInit = $rootScope.$on('init', function(event, mass) {
    console.log("Init() from NotificationCtrl: ",mass);
    init();
  });
  $rootScope.$on('$destroy', function() {
    cleanUpFuncInit();
  });


  var getAllNotifications = function(){

    $ionicLoading.show();
    $http.post(SERVER_ROOT_PATH + '/client/getNotifications').

      then(function (res) { //here we should get
        console.log('getNotification API response :',res);
        $scope.notifications = res.data.result;
        $scope.notificationImg = $rootScope.notificationImages;

        angular.forEach($scope.notifications, function(key) {

          var time = key.createDate;
          var date = key.createDate;
          time = moment(time).format('HH:mm');
          //console.log('Time of not: ', time );
          //console.log('Date of not: ', moment(date).format('MMMM Do, YYYY') );

          key.humenTime = time;
          key.humenDate = moment(date).format('MMMM Do, YYYY');
        });

        $ionicLoading.hide();

      }, function (err) {
        console.log("Error - ajax call was failed:  getAllApps API - ", err);
      });
  };

  $scope.openNotification = function(notificationObj){

    console.log("Notification: ",notificationObj);
    //First check that notification is still exist
    if(notificationObj.type && notificationObj.isActive == true){

      //Check if notification is survey
      if(notificationObj.type == 'survey'){
        $localstorage.set($localstorage.localSTypes.BNSState, 'tab.notification');
        $state.go('survey',{surveyId : notificationObj.entityId});
      }
    }
    else{
      var alertPopup = $ionicPopup.alert({
        title: "אופס",
        template: "הבחירה אינה קיימת יותר"
      });
    }

  };

  /**************************************************************************************************/
  function init(){
    getAllNotifications();

    if($rootScope.numOfNotifications && $rootScope.numOfNotifications > 0){
      //console.log('$rootScope.numOfNotifications > 0');
      $http.post(SERVER_ROOT_PATH + '/client/markNotification')
        .then(function(res){
          console.log('Response from markNotification', res.data.result);
          $rootScope.numOfNotifications = 0;
        },function(err){
          console.log('Error from markNotification', err);
        })
    }
  }

  init();

  /**************************************************************************************************/

});
