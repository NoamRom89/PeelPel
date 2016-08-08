'use strict';
/**
  * controller  - profile
*/
app.controller('ProfileCtrl', function($scope, $rootScope, $http, userFactory, APP_REGEX, $localstorage,$ionicLoading,$state,$cordovaCamera,$ionicAnalytics){

  var lsValue =  $localstorage.get($localstorage.localSTypes.BNSToken);
  $http.defaults.headers.post['x-access-token'] = lsValue;



  var coverImage = "https://s3-eu-west-1.amazonaws.com/bnsolutions/default_profile_cover.jpg";
  //$scope.profileImg;
  $scope.profileSection=[
    {"heb":"תחביבים","eng":"hobbies"},
    {"heb":"מועדפים-פעילויות","eng":"activity"}
  ];
  $scope.hobbeisToPresnt = null;

  var errorActivity = {title:"אין פעיליות שמורות"};
  var errorHobbies = {key:"אין תחביבים"};
  var usersFavoritesHobbies = [];
  var hobbies = null;
  var user = null;

  /******** $On - $Brodcast  ***********/
  var cleanUpFuncInit = $rootScope.$on('init', function(event, mass) {
    console.log("Init() from ProfielCtrl: ",mass);
    init();
  });
  var cleanUpFuncHobbies = $rootScope.$on('addOrRemoveHobbies', function(event, mass) {
    updateUser();
  });
  var cleanUpFuncFavActivity = $rootScope.$on('addFavorieActivity', function(event, mass) {
    updateUser();
  });

  /** User changing his background Image  **/
  $scope.choosePhoto = function () {
    var options = {
      quality: 100,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 300,
      targetHeight: 300,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };

    $cordovaCamera.getPicture(options)
      .then(function (imageData) {
        $scope.imgURI = "data:image/jpeg;base64," + imageData;

        //console.log('imageData - the less one:',imageData);
        //console.log('$scope.imgURI - the less one:',$scope.imgURI);

        var photoObj = {};
        photoObj.cover = {
          file : imageData,
          filename : 'filename',
          filetype : 'image/jpeg'
        };

        //If upload image was succeeded - update the user settings
        if($scope.imgURI != null){
          $rootScope.connectedUser.cover.path = $scope.imgURI;
          //console.log('$rootScope.connectedUser - updated:',$rootScope.connectedUser);
          $http.post(SERVER_ROOT_PATH + '/client/updateProfile', {options : photoObj})
            .then(function(res){
              console.log("Success! update user succeeded: ", res);
            }, function(err){
              console.log("Error updating user's settings: ",err);
            })
        }
        else{
          console.log('$scope.imgURI != null - image wasnt saved in DB');

        }

    }, function (err) {
      // An error occured. Show a message to the user
      console.log("Can't upload Image - ERROR - ngCordova");
    });


  };

  /*******************************  Check if group name is Hobbies  ******************************************/
  $scope.ifHobbiesName = function(group){

    if(group.nameEng == "hobbies"){
        return true
    }
    return false;

  };


  /** Get Updated User  **/
  var updateUser = function(){


    $http.post(SERVER_ROOT_PATH + '/client/getUser', { userId: $rootScope.connectedUser._id }).
      success(function (response) {

        $rootScope.connectedUser = response.result;
        console.log("Updated User: ", $rootScope.connectedUser);
        if($rootScope.connectedUser){
          checkFavoritesHobbies();
        }

      });

  };
  /********************************************** hobbies ***************************************************/

  function checkFavoritesHobbies(){
    usersFavoritesHobbies = $rootScope.connectedUser.hobbies;
    $scope.hebrewNames = $rootScope.hobbieHebrewName;
    //console.log("user's hobbies:", usersFavoritesHobbies);
      initialization();
  }

  /*******************************  initialization sectionProfile  ******************************************/
  function initialization(){

    $scope.groups = [];

    for (var i = 0; i < $scope.profileSection.length; i++) {
      $scope.groups[i] = {
        nameEng: $scope.profileSection[i].eng,
        nameHeb: $scope.profileSection[i].heb
      };

      if($scope.groups[i].nameEng == "hobbies"){
        $scope.groups[i].itemsHobbies = [];
        if(usersFavoritesHobbies.length > 0){
          for(var j = 0; j < usersFavoritesHobbies.length; j++) {
            $scope.groups[i].itemsHobbies.push(usersFavoritesHobbies[j]);
            $scope.hasHobbies = true;
            $scope.ifHobbies = true;
          }
        }
        else {
            $scope.groups[i].itemsHobbies.push(errorHobbies);
          $scope.hasHobbies = false;
          $scope.ifHobbies = false;
          }
        continue;
      }

      if($scope.groups[i].nameEng == "activity"){
        $scope.groups[i].itemsActivity = [];
        var activityFavorite = $rootScope.connectedUser.favorites.activities;

        if(activityFavorite == null ||activityFavorite.length == 0){
          $scope.groups[i].itemsActivity.push(errorActivity);
          $scope.hasActivities = false;
          continue;
        }
        for(var j = 0; j < activityFavorite.length; j++) {
          $scope.groups[i].itemsActivity.push(activityFavorite[j].activity);
        }
        $scope.hasActivities = true;
      }
    }

    //console.log("Groups:",$scope.groups);
    $ionicLoading.hide();

    /*
     * if given group is the selected group, deselect it
     * else, select the given group
     */
    $scope.toggleGroup = function(group) {
      if ($scope.isGroupShown(group)) {
        $scope.shownGroup = null;
        $ionicAnalytics.track('User close toggle - Profile', {
          userId: $rootScope.connectedUser._id,
          userName: $rootScope.connectedUser.firstName,
          eventDescription:'User Press on group ' + group.nameEng + ' from profile page',
          groupName:group.nameEng
        });
      } else {
        $scope.shownGroup = group;
        $ionicAnalytics.track('User open toggle - Profile', {
          userId: $rootScope.connectedUser._id,
          userName: $rootScope.connectedUser.firstName,
          eventDescription:'User Press on group ' + group.nameEng + ' from profile page',
          groupName:group.nameEng
        });
      }
    };
    $scope.isGroupShown = function(group) {
      return $scope.shownGroup === group;
    };

  }

  /*******************************  Add or Remove a hobbies  ******************************************/
  $scope.removeHobbie = function(hobbie, index) {

    hobbie.hobbieSelected = !hobbie.hobbieSelected;

    var spliceIndex;
    console.log("Hobbie to be removed: ", hobbie);

    $http.post(SERVER_ROOT_PATH + '/client/removeHobbie', {hobbieId : hobbie._id}).

      then(function (res) {

        if (res.data.error) {
          console.log("Error removing hobbies");
        }



        if($scope.groups[index].nameEng == "hobbies"){
          spliceIndex =  $scope.groups[index].itemsHobbies.indexOf(hobbie);
          console.log("spliceIndex", spliceIndex);
          if(spliceIndex > -1){
            //console.log('$scope.groups[index].itemsHobbies',$scope.groups[index].itemsHobbies[spliceIndex]);
            var hobbieIndex = $rootScope.connectedUser.hobbies[$scope.groups[index].itemsHobbies[spliceIndex]];

            $scope.groups[index].itemsHobbies.splice(spliceIndex,1);
            $rootScope.connectedUser.hobbies.splice(hobbieIndex,1);


            console.log("Hobbie was removed from hobbies section: success!" ,res.data);
            $rootScope.$broadcast('removingHobbies', "Hobbies have been updated");
          }
          if($scope.groups[index].itemsHobbies.length == 0){
              $scope.groups[index].itemsHobbies.push(errorHobbies);
              $scope.hasHobbies = false;
            $scope.ifHobbies = false;
          }
        }


      }, function (err) {
        console.log("Error - ajax call was failed:  /client/removeHobbie - ", err);
      });

    $ionicAnalytics.track('User removed hobbies - Profile', {
      userId: $rootScope.connectedUser._id,
      userName: $rootScope.connectedUser.firstName,
      eventDescription:'User removed hobbie:  ' + hobbie._id + ' from profile page',
      groupName:group.nameEng
    });

  };


  /*******************************  Remove favorite Activity  ******************************************/
  $scope.remove = function(obj, index) {

    console.log("Object to be removed from favorites:" ,obj, 'index of group: ', index);
    var spliceIndex;

    if($rootScope.connectedUser.favorites) {
      $http.post(SERVER_ROOT_PATH + '/client/removeFromFavorites',{id : obj._id}).

        then(function (res) {
          if (res.data.err) {
            console.log("Error removing favorites ", res.data.err);
            return;
          }

          if($scope.groups[index].nameEng == "activity"){
            spliceIndex =  $scope.groups[index].itemsActivity.indexOf(obj);
            $scope.groups[index].itemsActivity.splice(spliceIndex,1);
            console.log("Item was removed from favorites: success!" ,res.data);
            $rootScope.$broadcast('initCalendar', "Calendar have been updated");

            if($scope.groups[index].itemsActivity.length == 0){
              $scope.groups[index].itemsActivity.push(errorActivity);
              $scope.hasActivities = false;
            }
          }

        }, function (err) {
          console.log("Error - ajax call was failed:  /client/removeHobbie - ", err);
        });
    }

    $ionicAnalytics.track('User removed favorite activity - Profile', {
      userId: $rootScope.connectedUser._id,
      userName: $rootScope.connectedUser.firstName,
      eventDescription:'User removed activity:  ' + obj._id + ' from profile page'
    });

  };

  $scope.gotoActivity = function(activity){
    if(!activity || activity._id == ''){
      return;
    }

    $localstorage.set($localstorage.localSTypes.BNSState, 'tab.profile');
    $state.go('activity', {activityId: activity._id});

    $ionicAnalytics.track('User go to favorite activity - Profile', {
      userId: $rootScope.connectedUser._id,
      userName: $rootScope.connectedUser.firstName,
      eventDescription:'User removed hobbie:  ' + activity._id + ' from profile page',
      groupName:group.nameEng
    });
  };


  /*******************************  Destroy Broducast  ******************************************/
  $rootScope.$on('$destroy', function() {
    cleanUpFuncInit();
    cleanUpFuncHobbies();
    cleanUpFuncFavActivity();
  });
  /**************************************************** init () **************************************************/

  function init(){
    $ionicLoading.show();
      userFactory.promiseFunc().then(function (data) {
        $rootScope.connectedUser = data.data.result;
        //console.log("Making a promise call from factory: ", $rootScope.connectedUser);
        if($rootScope.connectedUser){
          checkFavoritesHobbies();
          //Background+Profile img need to be in user's profile.
          console.log("$rootScope.connectedUser: ", $rootScope.connectedUser);
          $scope.backgroundImg = $rootScope.connectedUser.cover.path ? $rootScope.connectedUser.cover.path : coverImage;
          console.log("$rootScope.connectedUser.cover.path: ", $rootScope.connectedUser.cover.path);
        }
      });

  }

  init();
  /********************************************************************************************************************/
});
