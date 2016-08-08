'use strict';
/**
*
*/
app.controller('AppCtrl', function($scope, $ionicModal, $timeout,$rootScope,$localstorage,$http,userFactory,$state,$ionicAnalytics) {


  // Global app variable
  $rootScope.app = {
    name: 'BNS Solutions', // name of your project
    author: 'BNS Solutions', // author's name or company name
    description: '', // brief description
    version: '1.0', // current version
    year: ((new Date()).getFullYear()), // automatic current year (for copyright information)
    platform:{
      isWebView:ionic.Platform.isWebView,
      isIPad:ionic.Platform.isIPad(),
      isIOS:ionic.Platform.isIOS(),
      isAndroid:ionic.Platform.isAndroid(),
      isWindowsPhone:ionic.Platform.isWindowsPhone()
    },
    currentPlatform:ionic.Platform.platform(),
    currentPlatformVersion:ionic.Platform.version(),
    deviceInformation:ionic.Platform.device()
  };

  $rootScope.deviceCredentials = {
    //your-authorization-token
    jwt: "fHuGlyPmUlc:APA91bHgV5G7LLWXJqlR2pXTCi2QeMOJhyf2GbOOEOEpcizi-nNB3nLFeQErZC7Mr7WrQYLRz6rAxUADAB1rr9aJ84pqZVyZAYRU4OsAfsi_babXDbgUV6g1_Z1JooMPG9xzszorKSPc",
    //'your', 'target', 'tokens' - to which device should the push should be send
    token: '',
    //Security Profile Name
    profile: "bns"
  };

  $rootScope.events = {
    types: {},
    actions: {}
  };

  $rootScope.hobbieHebrewName = {
    "basketball":"כדורסל",
    "football":"כדורגל",
    "tennis":"טניס",
    "shopping":"קניות",
    "travel":"לטייל",
    "paint":"ציור",
    "sculpture":"פיסול",
    "baseball":"בייסבול",
    "billiard":"ביליארד",
    "bowling":"באולינג",
    "chemistry":"כימיה",
    "physics":"פיסיקה",
    "photography":"צילום",
    "guitar":"גיטרה",
    "animals":"בעלי חיים",
    "singing": "שירה",
    "music":"מוסיקה",
    "shows":"הצגות",
    "gadgets":"גאדג'יטים",
    "wine":"יין",
    "beer":"בירה",
    "realestate":"קריאה",
    "entrepreneurship":"יזמות",
    "virtualr":"מציאות  מדומה",
    "movies":"סרטים",
    "coding":"תכנות",
    "design":"עיצוב",
    "baking":"אפיה",
    "tracking":"מסלולים",
    "אין תחביבים":"אין תחביבים"
  };

  $rootScope.notificationImages =  {
    'broadcastMessage': {
      small: 'https://s3-eu-west-1.amazonaws.com/bnsolutions-essentials/loudspeaker.png',
      medium: 'https://s3-eu-west-1.amazonaws.com/bnsolutions-essentials/loudspeaker.png',
      large: 'https://s3-eu-west-1.amazonaws.com/bnsolutions-essentials/loudspeaker.png'
    },
    'mission': {
      small: 'https://s3-eu-west-1.amazonaws.com/bnsolutions-essentials/calendar.png',
      medium: 'https://s3-eu-west-1.amazonaws.com/bnsolutions-essentials/calendar.png',
      large: 'https://s3-eu-west-1.amazonaws.com/bnsolutions-essentials/calendar.png'
    },
    'message': {
      small: 'https://s3-eu-west-1.amazonaws.com/bnsolutions-essentials/paper-plane.png',
      medium: 'https://s3-eu-west-1.amazonaws.com/bnsolutions-essentials/paper-plane.png',
      large: 'https://s3-eu-west-1.amazonaws.com/bnsolutions-essentials/paper-plane.png'
    },
    'survey': {
      small: 'https://s3-eu-west-1.amazonaws.com/bnsolutions-essentials/ebook.png',
      medium: 'https://s3-eu-west-1.amazonaws.com/bnsolutions-essentials/ebook.png',
      large: 'https://s3-eu-west-1.amazonaws.com/bnsolutions-essentials/ebook.png'
    }
  };

  $rootScope.activityImageEnum = {
    'default': {
      "small": "https://s3-eu-west-1.amazonaws.com/bnsolutions-essentials/default128.png",
      "medium": "https://s3-eu-west-1.amazonaws.com/bnsolutions-essentials/default128.png",
      "large": "https://s3-eu-west-1.amazonaws.com/bnsolutions-essentials/default128.png"
    },
    '575ed17a2056faec1c1f6d18': {
      "small": "https://s3-eu-west-1.amazonaws.com/bnsolutions-essentials/indoor128.png",
      "medium": "https://s3-eu-west-1.amazonaws.com/bnsolutions-essentials/indoor128.png",
      "large": "https://s3-eu-west-1.amazonaws.com/bnsolutions-essentials/indoor128.png"
    },
    '575ed17a2056faec1c1f6d19': {
      "small": "https://s3-eu-west-1.amazonaws.com/bnsolutions-essentials/technology128.png",
      "medium": "https://s3-eu-west-1.amazonaws.com/bnsolutions-essentials/technology128.png",
      "large": "https://s3-eu-west-1.amazonaws.com/bnsolutions-essentials/technology128.png"
    },
    '575ed17a2056faec1c1f6d1a': {
      "small": "https://s3-eu-west-1.amazonaws.com/bnsolutions-essentials/outdoor128.png",
      "medium": "https://s3-eu-west-1.amazonaws.com/bnsolutions-essentials/outdoor128.png",
      "large": "https://s3-eu-west-1.amazonaws.com/bnsolutions-essentials/outdoor128.png"
    },
    '575ed17a2056faec1c1f6d1c': {
      "small": "https://s3-eu-west-1.amazonaws.com/bnsolutions-essentials/culture128.png",
      "medium": "https://s3-eu-west-1.amazonaws.com/bnsolutions-essentials/culture128.png",
      "large": "https://s3-eu-west-1.amazonaws.com/bnsolutions-essentials/culture128.png"
    },
    '575ed17a2056faec1c1f6d1d': {
      "small": "https://s3-eu-west-1.amazonaws.com/bnsolutions-essentials/sports128.png",
      "medium": "https://s3-eu-west-1.amazonaws.com/bnsolutions-essentials/sports128.png",
      "large": "https://s3-eu-west-1.amazonaws.com/bnsolutions-essentials/sports128.png"
    },
    '575ed17a2056faec1c1f6d1e': {
      "small": "https://s3-eu-west-1.amazonaws.com/bnsolutions-essentials/food128.png",
      "medium": "https://s3-eu-west-1.amazonaws.com/bnsolutions-essentials/food128.png",
      "large": "https://s3-eu-west-1.amazonaws.com/bnsolutions-essentials/food128.png"
    },
    '575ed17a2056faec1c1f6d1f': {
      "small": "https://s3-eu-west-1.amazonaws.com/bnsolutions-essentials/martialart128.png",
      "medium": "https://s3-eu-west-1.amazonaws.com/bnsolutions-essentials/martialart128.png",
      "large": "https://s3-eu-west-1.amazonaws.com/bnsolutions-essentials/martialart128.png"
    },
    '575ed17a2056faec1c1f6d20': {
      "small": "https://s3-eu-west-1.amazonaws.com/bnsolutions-essentials/art128.png",
      "medium": "https://s3-eu-west-1.amazonaws.com/bnsolutions-essentials/art128.png",
      "large": "https://s3-eu-west-1.amazonaws.com/bnsolutions-essentials/art128.png"
    },
    '575ed17a2056faec1c1f6d21': {
      "small": "https://s3-eu-west-1.amazonaws.com/bnsolutions-essentials/music128.png",
      "medium": "https://s3-eu-west-1.amazonaws.com/bnsolutions-essentials/music128.png",
      "large": "https://s3-eu-west-1.amazonaws.com/bnsolutions-essentials/music128.png"
    },
    '575ed17a2056faec1c1f6d22': {
      "small": "https://s3-eu-west-1.amazonaws.com/bnsolutions-essentials/nature128.png",
      "medium": "https://s3-eu-west-1.amazonaws.com/bnsolutions-essentials/nature128.png",
      "large": "https://s3-eu-west-1.amazonaws.com/bnsolutions-essentials/nature128.png"
    },
    '575ed17a2056faec1c1f6d23': {
      "small": "https://s3-eu-west-1.amazonaws.com/bnsolutions-essentials/fashion128.png",
      "medium": "https://s3-eu-west-1.amazonaws.com/bnsolutions-essentials/fashion128.png",
      "large": "https://s3-eu-west-1.amazonaws.com/bnsolutions-essentials/fashion128.png"
    },
    '575fd930dcba0f7813100540': {
      "small": "https://s3-eu-west-1.amazonaws.com/bnsolutions-essentials/movies128.png",
      "medium": "https://s3-eu-west-1.amazonaws.com/bnsolutions-essentials/movies128.png",
      "large": "https://s3-eu-west-1.amazonaws.com/bnsolutions-essentials/movies128.png"
    },
    '575fdc16dcba0f78131005d0': {
      "small": "https://s3-eu-west-1.amazonaws.com/bnsolutions-essentials/indoor128.png",
      "medium": "https://s3-eu-west-1.amazonaws.com/bnsolutions-essentials/indoor128.png",
      "large": "https://s3-eu-west-1.amazonaws.com/bnsolutions-essentials/indoor128.png"
    }
  };

  $rootScope.categoryHebrewName = {
    'default': {
      "small": "https://s3-eu-west-1.amazonaws.com/bnsolutions-essentials/default128.png",
      "medium": "https://s3-eu-west-1.amazonaws.com/bnsolutions-essentials/default128.png",
      "large": "https://s3-eu-west-1.amazonaws.com/bnsolutions-essentials/default128.png"
    },
    'indoor': "ic_cameraman.png",
    '57828ad585bdc2b81266e134': "ic_computing.png",
    '57828ad585bdc2b81266e135': "ic_gallery.png",
    '57828ad585bdc2b81266e136': "ic_social_studies.png",
    '57828ad585bdc2b81266e138': "ic_hamburger.png",
    'martialArt': 'אומנויות לחימה',
    '57828ad585bdc2b81266e13a': "ic_music_saxophone.png",
    '57828ad585bdc2b81266e13b': "ic_biology.png",
    '57828ad585bdc2b81266e137': "ic_boxer.png",
    '57828ad585bdc2b81266e139': "ic_brush.png",
    'fashion': 'אופנה',
    'movies': 'סרטים',
    'politics': 'פוליטיקה',
    '57828ad585bdc2b81266e13d': "ic_stats_bar_chart.png",
    '57828ad585bdc2b81266e142': "ic_bandwidth4.png",
    '57828ad585bdc2b81266e143': "ic_cameraman.png",
    '57828ad585bdc2b81266e13c': "ic_film_projector2.png",
    '57828ad585bdc2b81266e13e': "ic_beer_star.png",
    '57828ad585bdc2b81266e13f': "ic_turtle.png",
    '57828ad585bdc2b81266e141': "ic_physics_pendulum.png",
    '57828ad585bdc2b81266e140': "ic_chemistry_test_tube.png",
    '578fd3bd811003002af56b6f':'ic_admissions.png',
    '578fd3bd811003002af56b70':'ic_virus.png',
    '578fd3bd811003002af56b71':'ic_intensive_care_unit.png',
    '578fd3bd811003002af56b72':'ic_avatar.png',
    '578fd3bd811003002af56b73':'ic_sthetoscope.png',
    '578fd3bd811003002af56b74':'ic_classmate.png'
  };



  //console.log("Main.js");
  userFactory.promiseFunc().then(function (data) {

     $rootScope.connectedUser = data.data.result;

     if($rootScope.connectedUser){
       //console.log("$rootScope.connectedUser: ", $rootScope.connectedUser);
    }
  });


  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:



  $scope.$on('$ionicView.enter', function(e,state) {
    var lsValue =  $localstorage.get($localstorage.localSTypes.BNSToken);

    //console.log('Main.js event - states: ',state);
    if($rootScope.connectedUser){
      $ionicAnalytics.track('State Change', {
        userId: $rootScope.connectedUser._id,
        stateId: state.stateId,
        eventDescription:'User enter to activity'
      });
    }else{
        userFactory.promiseFunc().then(function (data) {

          $rootScope.connectedUser = data.data.result;

          if($rootScope.connectedUser){
            $ionicAnalytics.track('State Change', {
              userId: $rootScope.connectedUser._id,
              stateId: state.stateId,
              eventDescription:'User enter to activity'
            });
          }
        });
    }


    //console.log("Entering the main.js - $ionicView.enter");
    if (!lsValue) {
      console.log("No token, go to login page");
      $state.go('login');
    }

    /** Check if rootScoop already holding the logs enum for the events **/
    if(!$rootScope.events.types || !$rootScope.events.types.actions){

      $http.defaults.headers.post['x-access-token'] = lsValue;

      $http.post(SERVER_ROOT_PATH + '/client/getEventEnum').
        then(function (response) {
          $rootScope.events.types = response.data.types;
          $rootScope.events.actions = response.data.actions;
        }, function (err) {
          console.log("Error getting the data from - '/client/getEvenEnum'",err);
        });
    }



  });
});
