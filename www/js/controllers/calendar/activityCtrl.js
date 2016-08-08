'use strict';
/**
 * controller  - Activity
 */


app.controller('ActivityCtrl', function($scope, $rootScope, $http, userFactory, $state,$ionicPopup,$ionicPopover,$localstorage, $stateParams,$ionicLoading){

  var lsValue =  $localstorage.get($localstorage.localSTypes.BNSToken);
  $http.defaults.headers.post['x-access-token'] = lsValue;

  $scope.activity = {};

  /************************************ User press back  ***************************************************/
  $scope.goBack = function() {
    console.log("Returning back!");

    $state.go($localstorage.get($localstorage.localSTypes.BNSState));
  };

  /*********************************************************************************************************************************/

    $scope.getImageURL = function(){
      if(!$scope.activity || Object.keys($scope.activity).length <= 0 || !$scope.activity.photo)
        return;

      console.log('$scope.activity.photo.url',$scope.activity.photo.url);

      return {
        "background-image": "url("+ $scope.activity.photo.url +")"
      }
    };

    var days = {
      '0':'ראשון',
      '1':'שני',
      '2':'שלישי',
      '3':'רביעי',
      '4':'חמישי',
      '5':'שישי',
      '6':'שבת'
    };

    $scope.getDay = function(date){
      if(!date)
        return;

      return days[new Date(date).getDay()];
    };

   $scope.showDateFormat = function(){
     return moment($scope.activity.start).format('DD/MM/YYYY');
   };

  $scope.showHourFormat = function(){
    return moment($scope.activity.start).format('HH:mm')
  };
  /************************************ API call - receiving the user's activity  ***************************************************/
  function getSingleActivity() {

    $ionicLoading.show();
    $http.post(SERVER_ROOT_PATH + '/client/getOneActivity',{id: $stateParams.activityId}).

      then(function (userActivity) {

        if (userActivity.data.error) {
          // handle error.
          console.log('Receiving activity error:', userActivity.data.error.message);
          return;
        }
        console.log('userActivity:', userActivity);

        if(userActivity.data.result.length > 0){
            $scope.activity = userActivity.data.result[0];

          console.log("Activity: ",$scope.activity);


            //Converting moment time to human time
            // $scope.activity.start = moment($scope.activity.start).format('HH:mm DD/MM/YYYY');
          $ionicLoading.hide();
        }
        else{
          console.log("Error receiving activity - null");
          $ionicLoading.hide();
        }

      }, function (err) {
        console.log("Error - ajax call was failed:  /client/timetable/get - ", err);
        $ionicLoading.hide();
      });
  }

  /*********************************************************************************************************************************/


  //1st initialized of the page
  var init = function(){

    console.log("From init(),stateParams: ", $stateParams);
    if(!$stateParams){
      $state.go('tab.calendar');
    }
    getSingleActivity();

  };


  init();


});
