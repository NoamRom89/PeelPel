'use strict';
/**
  * controller  - profile
*/

app.controller('ResidentProfileCtrl', function($scope, $rootScope, $http, $stateParams, $localstorage,$ionicLoading,$state,userFactory,$ionicAnalytics){

  var profileTimer;

  var lsValue =  $localstorage.get($localstorage.localSTypes.BNSToken);
  $http.defaults.headers.post['x-access-token'] = lsValue;


  //Background+Profile img need to be in user's profile.
  $scope.events = [];
  $scope.backgroundImg = "https://s3-eu-west-1.amazonaws.com/bnsolutions/default_profile_cover2.jpg";
  $scope.profileSection=[
    {"heb":"תחביבים","eng":"hobbies"},
    {"heb":"מועדפים-פעילויות","eng":"activity"}
  ];
  $scope.hobbeisToPresnt = null;

  var errorActivity = {title:"אין פעיליות שמורות"};
  var errorHobbies = {key:"אין תחביבים"};
  var hobbies = null;
  $scope.hobbeisToPresnt = null;
  $scope.resident = null;


  /*******************************  Remove an article or Activity  ******************************************/


  $scope.gotoActivity = function(activity){
    if(!activity || activity._id == ''){
      return;
    }
    $localstorage.set($localstorage.localSTypes.BNSState, 'tab.filter');
    console.log("User go to activity - ",activity._id, "from user - ",$stateParams.residentId);
    $state.go('activity', {activityId: activity._id});
  };


  $scope.hasActivities = function(){
    if($rootScope.connectedUser.favorites.activities.length > 0){
      return true;
    }
    return false;
  };

  /*******************************  initialization sectionProfile  ******************************************/

  var initialization = function(){

    $scope.hobbies = $scope.resident.hobbies;
    console.log("All resident's hobbies: ",$scope.hobbies);

        $scope.groups = [];

        for (var i = 0; i < $scope.profileSection.length; i++) {
          $scope.groups[i] = {
            nameEng: $scope.profileSection[i].eng,
            nameHeb: $scope.profileSection[i].heb,
            itemsHobbies: [],
            itemsActivity:[]
          };

          if($scope.groups[i].nameEng == "hobbies"){
            if($scope.hobbies.length > 0){
              for(var j = 0; j < $scope.hobbies.length; j++) {
                $scope.groups[i].itemsHobbies.push($scope.hobbies[j]);
                $scope.groups[i].itemsHobbies[j].hobbieSelected = true;
              }
            }
            else {
              $scope.groups[i].itemsHobbies.push(errorHobbies);
            }
            continue;
          }

          if($scope.groups[i].nameEng == "activity"){
            var activityFavorite = $scope.resident.favorites.activities;

            if(activityFavorite == null ||activityFavorite.length == 0){
              $scope.groups[i].itemsActivity.push(errorActivity);
              continue;
            }
            for(var j = 0; j < activityFavorite.length; j++) {
              $scope.groups[i].itemsActivity.push(activityFavorite[j].activity);
            }
          }
        }

        //publicActivities();
        $ionicLoading.hide();

        /*
         * if given group is the selected group, deselect it
         * else, select the given group
         */
        $scope.toggleGroup = function(group) {
          //console.log("Group as been toggle:",group);
          if ($scope.isGroupShown(group)) {
            $scope.shownGroup = null;
            $ionicAnalytics.track('User close toggle - Resident Profile', {
              userId: $rootScope.connectedUser._id,
              userName: $rootScope.connectedUser.firstName,
              residentId: $scope.resident._id,
              eventDescription:'User Press on group ' + group.nameEng + ' from resident profile page',
              groupName:group.nameEng,
              residentName: $scope.resident.firstName
            });
          } else {
            $scope.shownGroup = group;

            $ionicAnalytics.track('User open toggle - Resident Profile', {
              userId: $rootScope.connectedUser._id,
              userName: $rootScope.connectedUser.firstName,
              residentId: $scope.resident._id,
              eventDescription:'User Press on group ' + group.nameEng + ' from resident profile page',
              groupName:group.nameEng,
              residentName: $scope.resident.firstName
            });
          }
        };
        $scope.isGroupShown = function(group) {
          return $scope.shownGroup === group;
        };


  };

  /************************   User press back *************************************/
  $scope.goBack = function() {
    clearTimeout(profileTimer);

    $ionicAnalytics.track('Leave Resident Profile - Resident Profile', {
      userId: $rootScope.connectedUser._id,
      residentId: $scope.resident._id,
      eventDescription:'User Press back from resident profile page'
    });

    $state.go($localstorage.get($localstorage.localSTypes.BNSState));

  };

  /************************   Getting resident profile ****************************/
  var getProfileById = function(){

    $http.post(SERVER_ROOT_PATH + '/client/getUser', {userId : $stateParams.residentId}).

      then(function (res) {
        if(res.data.error){
          console.log("Error getting user");
          return;
        }

        console.log("Resident Obj: ",res);
        $scope.resident = res.data.result;
        $scope.resident.cover.path = $scope.resident.cover.path ? $scope.resident.cover.path : $scope.backgroundImg;
        $scope.hebrewNames = $rootScope.hobbieHebrewName;
        initialization();

      }, function (err) {
        console.log("Error - ajax call was failed:  /client/getUser - ", err);
      });

  };

  /************************   Getting resident social activities ****************************/
  var publicActivities = function(){
    $http.post(SERVER_ROOT_PATH + '/client/getResidentActivities', {id : $stateParams.residentId})
      .then(function(res){
        console.log('Response from /client/getResidentActivities: ', res.data.result);
        $scope.events = res.data.result;
      }, function(err){
        console.log('Error from /client/getResidentActivities: ', err);
      })
  };

  function init(){

    console.log('Resident ID: ',$stateParams.residentId);
    $ionicLoading.show();
    getProfileById();

    profileTimer = setTimeout(function(){

      var log = {
        type: $rootScope.events.types.profile.key,
        action: $rootScope.events.actions.time.key,
        value: $stateParams.residentId
      };

      $http.post(SERVER_ROOT_PATH + '/client/addEventLog', {log : log}).

        then(function (res) {
          console.log('LOG - profile time was occurred  :',res);

        }, function (err) {
          console.log("Error - ajax call was failed:  /client/addEventLog - ", err);
        });
    }, 10000);

    userFactory.promiseFunc().then(function (data) {

      $rootScope.connectedUser = data.data.result;
    });
  }

  init();

  /********************************************************************************************************************/
});
