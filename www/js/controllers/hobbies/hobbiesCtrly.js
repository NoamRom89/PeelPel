'use strict';
/**
  * controller  - filter
*/
app.controller('HobbiesCtrl', function($scope, $rootScope, $http, userFactory, $ionicPopup, $localstorage, $state, $ionicLoading,$ionicAnalytics){

  var lsValue =  $localstorage.get($localstorage.localSTypes.BNSToken);
  $http.defaults.headers.post['x-access-token'] = lsValue;

  $scope.hobbies = [];
  $scope.optionPressed = [];
  $scope.hebrewNames = $rootScope.hobbieHebrewName;

  var hoobiesToBeSend = [];
  var hobbie = {
    optionId: null,
    pressed:false
  };

  /*****************  $broadcast + $on + $destroy *****************/
  var cleanUpFuncInit = $rootScope.$on('init', function(event, mass) {
    console.log("Init() from NotificationCtrl: ",mass);
    init();
  });
  var cleanUpFuncHobbies = $rootScope.$on('removingHobbies', function(event, mass) {
    console.log(mass);
    getAllHobbies();
  });

  $rootScope.$on('$destroy', function() {
    cleanUpFuncHobbies();
    cleanUpFuncInit();
  });

  /****************************************************************/

  var myIndexOf = function (voteObjFalse) {
    for (var i = 0; i < $scope.optionPressed.length; i++) {
      if ($scope.optionPressed[i].pressed == voteObjFalse.pressed && $scope.optionPressed[i].optionId == voteObjFalse.optionId) {
        return i;
      }
    }
    return -1;
  };


  var getAllHobbies = function(){

    $http.post(SERVER_ROOT_PATH + '/client/getAllHobbies').

      then(function (res) {
        if(res.data.error){
          console.log("Error getting hobbies - profileCtrl.js");
          return;
        }

        $scope.hobbies = res.data.result;
        //console.log("All hobbies: ",$scope.hobbies);

        //First check that user have hobbies
        if($rootScope.connectedUser.hobbies.length > 0) {

          //If user have hobbies - run through all of the hobbies and on all user's hobbies
          for (var i = 0; i < $scope.hobbies.length; i++) {

            for (var j = 0; j < $rootScope.connectedUser.hobbies.length; j++) {

              //Check if there similarity between 2 hobbies ID's
              if ($rootScope.connectedUser.hobbies[j]._id == $scope.hobbies[i]._id) {
                $scope.hobbies[i].selected = true;
                break;

              } else {
                $scope.hobbies[i].selected = false;
              }
            }
          }
        }
        //If user doesn't have hobbies - mark all as selected false
        else{
          for (var index = 0; index < $scope.hobbies.length; index++) {
            $scope.hobbies[index].selected = false;
          }
        }
        console.log('$scope.hobbies: ', $scope.hobbies);
        $ionicLoading.hide();

      }, function (err) {
        console.log("Error - ajax call was failed:  /client/getAllHobbies - ", err);
      });
  };

  $scope.optionSelected = function(hobbieObj){

    //console.log("rootScope hobbies: ", $rootScope.connectedUser.hobbies);
    //If hobbie is unselected, enter here
    if(hobbieObj.selected){
      console.log("option to be unselected", hobbieObj);

      $ionicAnalytics.track('User remove hobbie - Hobbies', {
        userId: $rootScope.connectedUser._id,
        userName: $rootScope.connectedUser.firstName,
        eventDescription:'User unselected hobbie ',
        hobbieId: hobbieObj._id,
        hobbieName: hobbieObj.nameEng
      });

      //First lets check if hobbie is exist  in user's hobbies
        angular.forEach($rootScope.connectedUser.hobbies,function(userHobbie){
          if(hobbieObj._id == userHobbie._id){

            //remove hobbie from user's hobbies - DB
            $http.post(SERVER_ROOT_PATH + '/client/removeHobbie', {hobbieId:hobbieObj._id}).
              then(function (res) {
                if (res.data.error) {
                  console.log("Error adding hobbies");
                }
                //API call was succeded
                if(res.data.result){
                  console.log("Success removing hobbie! ",res.data.result);
                  $rootScope.$broadcast('addOrRemoveHobbies', "Hello from hobbies");
                }
              }, function (err) {
                console.log("Error - ajax call was failed:  /client/removeHobbie - ", err);
              });

          }

          console.log("If here - THEN hobbieObj.optionId != userHobbie._id");
      });

      //Check if hobbie is inside the optionPressed array
      var obj = {};
      obj.pressed = hobbieObj.selected;
      obj.optionId = hobbieObj._id;


      var spliceIndex = myIndexOf(obj);
      if(spliceIndex > -1){
        $scope.optionPressed.splice(spliceIndex,1);
      }

      obj = null;
      hobbieObj.selected = !hobbieObj.selected;
      console.log("$scope.optionPressed: ",$scope.optionPressed);


      return;
    }

    //Else, hobbie is selected
    console.log("Hobbie to be selected", hobbieObj);
    $ionicAnalytics.track('User added hobbie - Hobbies', {
      userId: $rootScope.connectedUser._id,
      userName: $rootScope.connectedUser.firstName,
      eventDescription:'User selected hobbie ',
      hobbieId: hobbieObj._id,
      hobbieName: hobbieObj.nameEng
    });
    hobbieObj.selected = !hobbieObj.selected;

    hobbie.pressed = hobbieObj.selected;
    hobbie.optionId = hobbieObj._id;


    if(hobbie.optionId != null){
      $scope.optionPressed.push(hobbie);
      hobbie = {};
    }

    console.log("$scope.optionPressed: ",$scope.optionPressed);
  };

  $scope.sendHobbies = function(){
    if($scope.optionPressed && $scope.optionPressed.length > 0){

      $ionicAnalytics.track('User send hobbies - Hobbies', {
        userId: $rootScope.connectedUser._id,
        userName: $rootScope.connectedUser.firstName,
        eventDescription:'User sent hobbies to DB '
      });

      //Send a bulk of all the hobbies of the selected user
      console.log("Hobbies to be send to DB:", $scope.optionPressed);

      console.log('$rootScope.connectedUser.hobbies: ',$rootScope.connectedUser.hobbies);


      var array = $scope.optionPressed.map(function(hobbieObj) {
        return hobbieObj.optionId;
      });


      $http.post(SERVER_ROOT_PATH + '/client/addHobbie', {hobbieId:array}).

        then(function (res) {
          if (res.data.error) {
            console.log("Error adding hobbies");
          }

          /** API call was succeded*/
          if(res.data.result){

            console.log("Success adding hobbies to user! ",res.data.result);
            var alertPopup = $ionicPopup.alert({
              title: "תחביבים",
              template:"תחביבים נשמרו בהצלחה!"
            });
            $rootScope.$broadcast('addOrRemoveHobbies', "Hello from hobbies");
            $scope.optionPressed = [];
          }
        },
        function (err) {
          console.log("Error - ajax call was failed:  /client/addHobbie - ", err);
        });


      $state.go('tab.profile');
    }
  };

  $scope.closeHobbies = function(){
    $state.go('tab.profile');
  };

  $scope.hasHobbies = function(){
    if($scope.optionPressed.length > 0)
      return true;

    return false;
  };




  /*********************************************************************************************************/


  function init(){
    $ionicLoading.show();
      userFactory.promiseFunc().then(function (data) {
        //console.log("data:",data);
        $rootScope.connectedUser = data.data.result;
        //console.log("Making a promise call from hobbieCtrl: ", $rootScope.connectedUser);
        if($rootScope.connectedUser){
          getAllHobbies();
        }
      });

  }

  init();
});
