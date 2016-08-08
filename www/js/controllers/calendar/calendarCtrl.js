'use strict';
/**
  * controller  - Calendar
*/


app.controller('CalendarCtrl', function($scope, $rootScope, $http, userFactory, $state,$ionicPopup,$ionicPopover,$localstorage,
                                        $timeout, $ionicLoading,$location, $anchorScroll,$ionicScrollDelegate,$ionicAnalytics){

  var lsValue =  $localstorage.get($localstorage.localSTypes.BNSToken);
  $http.defaults.headers.post['x-access-token'] = lsValue;

  var cleanUpFuncInit = $rootScope.$on('init', function(event, mass) {
    console.log("Init() from CalendarCtrl: ",mass);
    init();
  });
  var cleanUpFuncInitFromProfile = $rootScope.$on('initCalendar', function(event, mass) {
    console.log("Init() from CalendarCtrl: ",mass);
    init();
  });


  function getDateFormat(date){
    var today = new Date(date);
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!

    var yyyy = today.getFullYear();
    if(dd<10){
      dd='0'+dd
    }
    if(mm<10){
      mm='0'+mm
    }
    return dd+'/'+mm+'/'+yyyy;
  }

  $rootScope.connectedUser = {};
  $scope.moredata = false;
	$scope.activities = [];
  $scope.selectedTime = {};
  $scope.heartPressed = false;
  $scope.currentDate = new Date();

  $('.dateDisplyed').html(getDateFormat($scope.currentDate));

  var activitiesDates = [];
  var currDatePlus1 = new Date();



  /**************************  User press on Activity  ********************************/
  $scope.gotoActivity = function(activity){
    console.log("gotoActivity");
    if(!activity || activity._id == ''){
      return;
    }

    $ionicAnalytics.track('Activity Entrance - Calendar', {
      userId: $rootScope.connectedUser._id,
      activityId: activity._id,
      activityTitle: activity.title,
      eventDescription:'User enter to activity'
    });

    $localstorage.set($localstorage.localSTypes.BNSState, 'tab.calendar');
    $state.go('activity', {activityId: activity._id});
  };
  /**********************************************************************************************************************/

  $scope.gotScrolled = function() {
    var bnsActivity = $('.bnsMissionDesc');
    var bnsDateWrappers = $('.date-wrapper-activity');

    if(!bnsActivity || bnsActivity.length <= 0 || !bnsDateWrappers || bnsDateWrappers.length <= 0)
      return;

    bnsActivity = bnsActivity[0];

    var activityHeight = $(bnsActivity).height();
    if(activityHeight <= 0)
      return;

    var scrollFromTop = $ionicScrollDelegate.getScrollPosition().top;
    for(var i in bnsDateWrappers){
      var bdw = bnsDateWrappers[i];
      var offsetTop = bdw.offsetTop;
      var startPoint = offsetTop >= 200 ? offsetTop - 200 : 0;
      var endPoint = startPoint + activityHeight;
      if(scrollFromTop >= startPoint && scrollFromTop <= endPoint){
        var currDate = getDateFormat($scope.currentDate);
        var tempDate = getDateFormat(bdw.id);
        if(currDate != tempDate && bdw.id){
          $scope.currentDate = new Date(bdw.id);
          $('.dateDisplyed').html(getDateFormat(bdw.id));
          console.log('$scope.currentDate',$scope.currentDate);
          return;
        }
      }
    }
  };

  $scope.loadMore = function(){

    $ionicAnalytics.track('Get More Activities', {
      userId:  $rootScope.connectedUser._id,
      eventDescription: 'User scroll to the bottom of the page'
    });

    var bnsDateWrappers = $('.date-wrapper-activity');
    if(!bnsDateWrappers || bnsDateWrappers.length <= 0)
      return;

    var length = bnsDateWrappers.length;
    var firstDate = bnsDateWrappers[0].id;
    var lastDate = bnsDateWrappers[length - 1].id;

    if(!firstDate || !lastDate)
      return;

    //console.log('firstDate',firstDate);
    //console.log('lastDate',lastDate);
    var options = {
      dateFrom: firstDate,
      dateTo: moment(lastDate).add(1,'day').endOf('day')
    };

    console.log('options',options);
    $http.post(SERVER_ROOT_PATH + '/client/getMyActivities',{options:options}).

      then(function (userMissions) {
        if (userMissions.data.error) {
          // handle error.
          console.log('Receiving activities error:', userMissions.data.error.message);
          return;
        }

        console.log("Bringimg more activities: ",userMissions.data.result);
        $scope.activities = userMissions.data.result;
        console.log("Activities: ", $scope.activities);

        //Converting moment time to human time
        angular.forEach($scope.activities, function(key){

          activitiesDates = [];
          activitiesDates.push(key.start);
          key.startActivity = moment(key.start).format('HH:mm');

          if($rootScope.connectedUser.favorites.activities.length > 0){

            angular.forEach($rootScope.connectedUser.favorites.activities, function(activity){
              if(key._id == activity.activity._id){
                key.favorit = true;
              }
              else{
                key.favorit = false;
              }
            });
          }

          key.notify = false;
        });


        //angular.element(document).ready(function () {
        //  if($rootScope.connectedUser.favorites.activities.length != 0){
        //    jumpto();
        //  }
        //});


        $ionicLoading.hide();


      }, function (err) {
        console.log("Error - ajax call was failed:  /client/getMyActivities - ", err);
      });

};

  /**************************  Set the current Activity to be displayed  ********************************/
  function jumpto(){

    var currentDate = new Date();
    currentDate = moment(currentDate).format('HH:mm');
    //console.log("JumpTo, currentDate: ",currentDate, " ", new Date());

    var test = activitiesDates;

    //sorting all activities by start time
    test.sort(function(activityDate1,activityDate2){
      return new Date(activityDate1).getTime() - new Date(activityDate2).getTime();
    });


    //console.log("test - dates of activities(after sort): ",test);

    //finding the closest time (of activity) to be displayed
    var closest = test.reduce(function (prev, curr) {
      return (Math.abs(prev - currentDate) < Math.abs(curr - currentDate) ? prev : curr);
    });


    //closest = moment(closest).format('HH:mm');
    //console.log("closest time: ", closest);

    $location.hash(closest);

    //console.log("$location.hash(closest): ", $location.hash(closest));

    // call $anchorScroll()
    $anchorScroll();

  }

  $scope.refreshTasks = function() {

    console.log('Refreshing');
    $ionicAnalytics.track('Force Refresh', {
      userId:  $rootScope.connectedUser._id,
      eventDescription: 'User press on force refresh'
    });

    var bnsDateWrappers = $('.date-wrapper-activity');
    if(!bnsDateWrappers || bnsDateWrappers.length <= 0)
      return;

    var length = bnsDateWrappers.length;
    var firstDate = bnsDateWrappers[0].id;
    var lastDate = bnsDateWrappers[length - 1].id;

    if(!firstDate || !lastDate)
      return;

    console.log('firstDate',firstDate);
    console.log('lastDate',lastDate);
    var options = {
      dateFrom: firstDate,
      dateTo: moment(lastDate).endOf('day')
    };

    $scope.getMissionById(options);

    $timeout(function() {
      $scope.$broadcast('scroll.refreshComplete');
      $scope.$broadcast('scroll.refreshComplete');
    }, 300);
  };


  /**
   * User press on date picker
   */
  $scope.datePickerCallback = function (val) {

    $ionicAnalytics.track('Date Picker - Calendar', {
      userId:  $rootScope.connectedUser._id,
      eventDescription: 'User press on datePicker'
    });

    if (val) {
      console.log('Selected date: ', val);
      var dayBegin = val.setHours(0,1,1);
      var dayEnd = val.setHours(23,59,59);
      console.log("dayBegin",dayBegin);
      console.log("dayEnd",dayEnd);
      var options = {
        dateFrom: dayBegin,
        dateTo: dayEnd
      };

      $ionicLoading.show();
      $http.post(SERVER_ROOT_PATH + '/client/getMyActivities',{options:options}).

        then(function (userMissions) {
          if (userMissions.data.error) {
            // handle error.
            console.log('Receiving activities error:', userMissions.data.error.message);
            return;
          }

          console.log('Receiving activities after datePicker:', userMissions.data.result);
          $scope.activities = userMissions.data.result;
          //console.log("Activities: ", $scope.activities);
          //console.log("User favorites activities: ", $rootScope.connectedUser.favorites.activities);

          //Converting moment time to human time
          angular.forEach($scope.activities, function(key){

            activitiesDates = [];
            activitiesDates.push(key.start);
            key.startActivity = moment(key.start).format('HH:mm');

            if($rootScope.connectedUser.favorites.activities.length > 0){

              angular.forEach($rootScope.connectedUser.favorites.activities, function(activity){
                if(key._id == activity.activity._id){
                  key.favorit = true;
                }
                else{
                  key.favorit = false;
                }
              });
            }

            key.notify = false;
          });


          angular.element(document).ready(function () {
            if($rootScope.connectedUser.favorites.activities.length != 0){
              jumpto();
            }
          });


          $ionicAnalytics.track('Date Picker - Choosing date', {
            userId:  $rootScope.connectedUser._id,
            eventDescription: 'User press on datePicker and choose a specific date',
            selectedDate:val
          });

          $ionicLoading.hide();


        }, function (err) {
          console.log("Error - ajax call was failed:  /client/getMyActivities - ", err);
        });

    }
  };

  /**
   * User press on a single day -  date picker
   */
  $scope.changeDate = function($event){
    console.log("Event: ",$event.srcElement.className);
    if($event.srcElement.className == 'afterDate activated'){
      console.log("The next day");
      return;
    }
    console.log("The day before");
  };



  /**
   * User press on reminder
   */
  $scope.reminder = function(activity) {
    console.log("User press on reminder", activity);

    $ionicAnalytics.track('Reminder - Calendar', {
      userId:  $rootScope.connectedUser._id,
      activityId: activity._id,
      eventDescription: 'User press on reminder'
    });

    var currDate = moment().utc();
    var activityDate = moment(activity.start).utc();
    //console.log('currDate(Moment)', currDate._d);
    //console.log('activityDate(Moment)', activityDate._d);

    if (currDate.isAfter(activityDate)) {
      var alertPopup = $ionicPopup.alert({
        template: "הפעילות התבצעה כבר"
      });
      return;
    }


    if (activity.notify != true) {

      //reminder is 15 minutes before activity start

      var newDateObj = activityDate.subtract(15,'minutes');
      console.log('Activity 15 minutes less to be reminded: ', newDateObj.format('YYYY-MM-DDTHH:mm:ssZ'));
      newDateObj = newDateObj.format('YYYY-MM-DDTHH:mm:ssZ');

        // Build the request object
      var req = {
        method: 'POST',
        url: 'https://api.ionic.io/push/notifications',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI0NjMyYTA1My1jNzgyLTQ5ZTYtYmQ3Ny0yNTgyMjAxZTViNTcifQ.TBw3gA5k98Jd-1JDABzR1QwxalF6OSsKz9PK_IZHEfU'
        },
        data: {
          "tokens": [$rootScope.deviceCredentials.token],
          "profile": "bns",
          "scheduled": newDateObj,
          "notification": {
            "title": activity.title,
            "message": "עוד רבע שעה מתחילה המשימה"  ,
            "android": {
              icon: 'res://youmepushnot.png',
              "icon_color": "#6CDFC0",
              badge: 1,
              "image": 'res://youmepushnot.png'
            }
          }
        }
      };

    // Make the API call
      $http(req).success(function(resp){
        // Handle success
        console.log("Ionic Push: Push success", resp);
        activity.notify = !activity.notify;
        var alertPopup = $ionicPopup.alert({
          title: "תזכורת",
          template: "15 דקות לפני תחילת המשימה תקבל תזכורת"
        });
      })
        .error(function(error){
        // Handle error
        console.log("Ionic Push: Push error", error);
        var errorPopup = $ionicPopup.alert({
          template: "המשימה מתחילה בקרוב, אין אפשרות לקבל התראה"
        });
      });

      //$http.post(SERVER_ROOT_PATH + '/client/setActivityAlarm', {id : activity._id})
      //  .then(function(res){
      //    if(res.data.err){
      //      console.log("Error while receiving the data from client/setActivityAlarm");
      //    }
      //    console.log("Success! remnder was set", res);
      //    activity.notify = !activity.notify;
      //  }, function(err){
      //    console.log(err);
      //  })
      }
  };



  /**
   * User add/remove activity to his favorites
   */
  $scope.favoritesBtn = function(activity){
    if(!activity.favorit){
      $ionicAnalytics.track('Favorite Activity - Add', {
        userId: $rootScope.connectedUser._id,
        activityId: activity._id,
        eventDescription: 'User press on favorite button - ADD'
      });
      $http.post(SERVER_ROOT_PATH + '/client/addActivityToFavorites',{activityId:activity._id}).

        then(function (res) {
          console.log('LOG - add activity to favorite:',res);
          if(res.data.result){
            activity.favorit = !activity.favorit;
            $rootScope.$broadcast('addFavorieActivity');
            console.log('activity.favorit after add', activity.favorit);
            //$scope.heartPressed = !$scope.heartPressed;
          }

        }, function (err) {
          console.log("Error - ajax call was failed:  /client/addActivityToFavorites - ", err);
        });
    } else{

      $ionicAnalytics.track('Favorite Activity - Remove', {
        userId: $rootScope.connectedUser._id,
        activityId: activity._id,
        eventDescription: 'User press on favorite button - REMOVE'
      });
      $http.post(SERVER_ROOT_PATH + '/client/removeFromFavorites',{id:activity._id}).

        then(function (res) {
          console.log('LOG - remove activity from favorite:',res);

          if(res.data.err){
            console.log('Error - can"t remove activity:', res.data.err.msg);
          }
          if(res.data.result){
            activity.favorit = !activity.favorit;
            console.log('activity.favorit after remove', activity.favorit);
            //$scope.heartPressed = !$scope.heartPressed;
          }

        }, function (err) {
          console.log("Error - ajax call was failed:  /client/removeFromFavorites - ", err);
        });
    }
  };


  $scope.dateToDay = function(start){
    var date = moment(start);
    if(!date)
      return "";

    var dow = date.day();
    if(dow < 0 || dow > 6)
      return "";

    var numToDay = {
      '0':"א",
      '1':"ב",
      '2':"ג",
      '3':"ד",
      '4':"ה",
      '5':"ו",
      '6':"ש"
    };

    var hebDay = numToDay[dow];
    if(!hebDay)
      return "";

    var day = "יום [DAY]";
    day = day.replace('[DAY]',hebDay);

    return day;

  };

  /**
   * This section treat all the API calls - get all the user's activities
   */

  //This function receive all activity per connected user
  $scope.getMissionById = function(date){

    console.log("$scope.activities after init(): ",$scope.activities);
    console.log("$rootScope.connectedUser.favorites.activities: ",$rootScope.connectedUser.favorites.activities);

    //If activities is already contains activities - pass the http call
    if($scope.activities.length > 0){
      angular.forEach($scope.activities, function(key){

        activitiesDates = [];
        activitiesDates.push(key.start);
        key.startActivity = moment(key.start).format('HH:mm');

        if($rootScope.connectedUser.favorites.activities.length > 0){

          angular.forEach($rootScope.connectedUser.favorites.activities, function(activity){
            if(key._id == activity.activity._id){
              key.favorit = true;
            }
            else{
              key.favorit = false;
            }
          });
        }else{
          key.favorit = false;
        }
      });
    }else{

    $ionicLoading.show();
    $http.post(SERVER_ROOT_PATH + '/client/getMyActivities',{options:date}).
      then(function (userMissions) {
        if (userMissions.data.error) {
          // handle error.
            console.log('Receiving activities error:', userMissions.data.error.message);
            return;
        }

        $scope.activities = userMissions.data.result;
        console.log("Activities: ", $scope.activities);
        //console.log("User favorites activities: ", $rootScope.connectedUser.favorites.activities);

        //Converting moment time to human time
        angular.forEach($scope.activities, function(key){

          activitiesDates.push(key.start);
          key.startActivity = moment(key.start).format('HH:mm');

          if($rootScope.connectedUser.favorites.activities.length > 0){

            angular.forEach($rootScope.connectedUser.favorites.activities, function(activity){
              if(key._id == activity.activity._id){
                key.favorit = true;
              }
              else{
                key.favorit = false;
              }
            });
          }

          key.notify = false;
        });


        angular.element(document).ready(function () {
          if($rootScope.connectedUser.favorites.activities.length != 0){
            jumpto();
          }
        });


        $ionicLoading.hide();


    }, function (err) {
        console.log("Error - ajax call was failed:  /client/getMyActivities - ", err);
        });
    }
  };


  /*******************************  Destroy Broducast  ******************************************/
  $rootScope.$on('$destroy', function() {
    cleanUpFuncInit();
    cleanUpFuncInitFromProfile();
  });


  /*******************************  Add new Activity to schedule  ******************************************/
  $scope.addNewActivity = function(){
    console.log("Adding new Activity - redirecting to new activity page");

    //move('#move-for-new-activity')
    //  .set('background-color', 'blue')
    //  .end();

    //$ionicAnalytics.track('Add New Activity - Calendar', {
    //  userId: $rootScope.connectedUser._id,
    //  eventDescription: 'User press on add new activity button - float button'
    //});

    $state.go('newActivity');

    //var bnsActivity = $('.bnsMissionDesc');
    //var bnsDateWrappers = $('.date-wrapper-activity');
    //
    //if(!bnsActivity || bnsActivity.length <= 0 || !bnsDateWrappers || bnsDateWrappers.length <= 0)
    //  return;
    //
    //bnsActivity = bnsActivity[0];
    //
    //var activityHeight = $(bnsActivity).height();
    //if(activityHeight <= 0)
    //  return;
    //
    //var scrollFromTop = $ionicScrollDelegate.getScrollPosition().top;
    //for(var i in bnsDateWrappers){
    //  var bdw = bnsDateWrappers[i];
    //  var offsetTop = bdw.offsetTop;
    //  var startPoint = offsetTop >= 200 ? offsetTop - 200 : 0;
    //  var endPoint = startPoint + activityHeight;
    //  //console.log("BDW:",bdw.id);
    //  //console.log("offsetTop:",offsetTop);
    //  //console.log("startPoint:",startPoint);
    //  //console.log("endPoint:",endPoint);
    //  //console.log("scrollFromTop:",scrollFromTop);
    //
    //  if(scrollFromTop < startPoint){
    //    //console.log("BDW:",bdw.id);
    //    //console.log("#+BDW:",'#'+bdw.id);
    //    move('.bnsHasDate #move-for-new-activity')
    //      .set('margin-top', 200)
    //      .end();
    //    return;
    //  }
    //}



    //move('.' + bdw)
    //  .set('margin-left', 200)
    //  .end();
  };

  //1st initialized of the page
  var init = function(){
    userFactory.promiseFunc().then(function (data) {
      //console.log('CalendarCtrl user after factory: ',data.data.result);

      $rootScope.connectedUser = data.data.result;
      //console.log("User from factory promise: ", $rootScope.connectedUser);

      if($rootScope.connectedUser){

        var dayBegin = $scope.currentDate;
        var dayEnd = $scope.currentDate;

        dayBegin = dayBegin.setHours(0,1,1);
        dayEnd = dayEnd.setHours(23,59,59);

        var options = {
          dateFrom: dayBegin,
          dateTo: dayEnd
        };
        $scope.getMissionById(options);
      }
    });
  };


  init();
  console.log("rootScope from calendar page:",$rootScope);



});
