'use strict';
/**
  * controller  - filter
*/
app.controller('FilterCtrl', function($scope, $rootScope, $http, userFactory, APP_REGEX, $localstorage, $state,$ionicLoading,$ionicAnalytics){


  var lsValue =  $localstorage.get($localstorage.localSTypes.BNSToken);
  $http.defaults.headers.post['x-access-token'] = lsValue;

  $scope.user = {};

  userFactory.promiseFunc().then(function (data) {
    $scope.user = data.data.result;
    //console.log("User from factory promise: ", $scope.user);
  });

  //get all the apartments
  $scope.allApartment = null;

  function getAllApartments(){

    $ionicLoading.show();
    $http.post(SERVER_ROOT_PATH + '/client/getResidentApartments').

      then(function (res) {
        //console.log('getAllApps API response :',res.data.result);
        $scope.allApartment = res.data.result;
        $ionicLoading.hide();


      }, function (err) {
        console.log("Error - ajax call was failed:  /client/getResidentApartments - ", err);
      });
  }



  $scope.gotoProfile = function(residentId){

    if(residentId == $rootScope.connectedUser._id){
      $state.go('tab.profile');
      return;
    }

    $ionicAnalytics.track('Enter Resident Profile - Filter', {
      userId: $rootScope.connectedUser._id,
      residentId: residentId,
      eventDescription:'User enter to resident profile'
    });

    var log = {
      type: $rootScope.events.types.profile.key,
      action: $rootScope.events.actions.entry.key,
      value: residentId
    };

    $http.post(SERVER_ROOT_PATH + '/client/addEventLog', {log : log}).

      then(function (res) {
        //console.log('LOG - viewing other resident profile :',res);

      }, function (err) {
        console.log("Error - ajax call was failed:  /client/addEventLog - ", err);
      });

    //console.log("User ID to be sent: ", residentId);
    $localstorage.set($localstorage.localSTypes.BNSState, 'tab.filter');
    $state.go('residentProfile', {residentId: residentId},{reload: true});
  };

  function init(){
    getAllApartments();

    if(!$rootScope.connectedUser){
      userFactory.promiseFunc().then(function (data) {
        $rootScope.connectedUser = data.data.result;
      });
    }
  }

  init();
});
